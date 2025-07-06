import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, DollarSign, Users } from 'lucide-react';
import { CalculoDetallado } from '@/hooks/useEstribosData';
import { formatCurrency } from '@/lib/utils';

interface Props {
  calculos: CalculoDetallado[];
}

export const ComparacionPrecios = ({ calculos }: Props) => {
  // Agrupar por estribo para la comparación
  const datosAgrupados = calculos.reduce((acc, calculo) => {
    const existente = acc.find(item => item.medida === calculo.estribo.medida);
    if (existente) {
      existente.proveedores.push({
        nombre: calculo.proveedor.nombre,
        costoBase: calculo.costoBase,
        precioSinIva: calculo.precioFinalSinIva,
        precioConIva: calculo.precioFinalConIva
      });
    } else {
      acc.push({
        medida: calculo.estribo.medida,
        peso: calculo.estribo.peso,
        proveedores: [{
          nombre: calculo.proveedor.nombre,
          costoBase: calculo.costoBase,
          precioSinIva: calculo.precioFinalSinIva,
          precioConIva: calculo.precioFinalConIva
        }]
      });
    }
    return acc;
  }, [] as any[]);

  // Datos para el gráfico de barras - costo de fabricación sin margen
  const datosGrafico = datosAgrupados.map(item => {
    const resultado: any = { medida: item.medida };
    item.proveedores.forEach((prov: any) => {
      resultado[prov.nombre] = prov.costoBase; // Solo costo de fabricación
    });
    return resultado;
  });

  // Datos para el gráfico de torta - comparación de precios por kg de proveedores
  const proveedoresUnicosMap = new Map();
  calculos.forEach(calculo => {
    if (!proveedoresUnicosMap.has(calculo.proveedor.nombre)) {
      proveedoresUnicosMap.set(calculo.proveedor.nombre, {
        nombre: calculo.proveedor.nombre,
        precioPorKg: calculo.proveedor.precioPorKg
      });
    }
  });
  const proveedoresUnicos = Array.from(proveedoresUnicosMap.values());

  // Análisis de diferencias
  const proveedorMasEconomicoKg = proveedoresUnicos.reduce((min, prov) => 
    prov.precioPorKg < min.precioPorKg ? prov : min
  );
  
  const proveedorMasCaroKg = proveedoresUnicos.reduce((max, prov) => 
    prov.precioPorKg > max.precioPorKg ? prov : max
  );

  const diferenciaPorcentualKg = ((proveedorMasCaroKg.precioPorKg - proveedorMasEconomicoKg.precioPorKg) / proveedorMasCaroKg.precioPorKg * 100).toFixed(1);

  // Análisis de costos de fabricación por unidad (promedio)
  const promediosPorProveedor = calculos.reduce((acc, calculo) => {
    const existente = acc.find(item => item.nombre === calculo.proveedor.nombre);
    if (existente) {
      existente.totalCostos += calculo.costoBase; // Solo costo base
      existente.count += 1;
    } else {
      acc.push({
        nombre: calculo.proveedor.nombre,
        totalCostos: calculo.costoBase,
        count: 1
      });
    }
    return acc;
  }, [] as any[]);

  const promediosFinales = promediosPorProveedor.map(prov => ({
    ...prov,
    promedio: prov.totalCostos / prov.count
  }));

  const proveedorMasEconomicoUnidad = promediosFinales.reduce((min, prov) => 
    prov.promedio < min.promedio ? prov : min
  );
  
  const proveedorMasCaroUnidad = promediosFinales.reduce((max, prov) => 
    prov.promedio > max.promedio ? prov : max
  );

  const diferenciaPorcentualUnidad = ((proveedorMasCaroUnidad.promedio - proveedorMasEconomicoUnidad.promedio) / proveedorMasCaroUnidad.promedio * 100).toFixed(1);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  const chartConfig = calculos.reduce((config, calculo, index) => {
    const color = COLORS[index % COLORS.length];
    config[calculo.proveedor.nombre] = {
      label: calculo.proveedor.nombre,
      color
    };
    return config;
  }, {} as any);

  const pieChartConfig = proveedoresUnicos.reduce((config, prov, index) => {
    config[prov.nombre] = {
      label: prov.nombre,
      color: COLORS[index % COLORS.length]
    };
    return config;
  }, {} as any);

  return (
    <div className="space-y-6">
      {/* Gráficos comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Costo de Fabricación por Unidad
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Costo base de fabricación de cada estribo por proveedor (sin margen ni IVA)
            </p>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">
                📊 Análisis: {proveedorMasEconomicoUnidad.nombre} tiene un costo de fabricación {diferenciaPorcentualUnidad}% más bajo por unidad que {proveedorMasCaroUnidad.nombre}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="medida" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), "Costo de Fabricación"]}
                />
                {Object.keys(chartConfig).map((proveedorNombre, index) => (
                  <Bar 
                    key={proveedorNombre}
                    dataKey={proveedorNombre} 
                    fill={chartConfig[proveedorNombre].color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de torta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Precios por Kilogramo
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparación de costos base por kilogramo entre proveedores (sin margen)
            </p>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">
                💡 Análisis: {proveedorMasEconomicoKg.nombre} ofrece {formatCurrency(proveedorMasEconomicoKg.precioPorKg)} por kg vs {formatCurrency(proveedorMasCaroKg.precioPorKg)} por kg ({diferenciaPorcentualKg}% diferencia)
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={proveedoresUnicos}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="precioPorKg"
                  nameKey="nombre"
                  label={({ nombre, precioPorKg }) => `${nombre}: ${formatCurrency(precioPorKg)}`}
                >
                  {proveedoresUnicos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), "Precio por Kg"]}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado de Precios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Medida</TableHead>
                  <TableHead className="font-bold text-center">Peso (kg)</TableHead>
                  <TableHead className="font-bold text-center">Proveedor</TableHead>
                  <TableHead className="font-bold text-center">Costo Base</TableHead>
                  <TableHead className="font-bold text-center">Precio Sin IVA</TableHead>
                  <TableHead className="font-bold text-center">Precio Con IVA</TableHead>
                  <TableHead className="font-bold text-center">IVA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculos.map((calculo, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-semibold">{calculo.estribo.medida}</TableCell>
                    <TableCell className="text-center">{calculo.estribo.peso.toFixed(4)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{calculo.proveedor.nombre}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(calculo.costoBase)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      {formatCurrency(calculo.precioFinalSinIva)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-success">
                      {formatCurrency(calculo.precioFinalConIva)}
                    </TableCell>
                    <TableCell className="text-center text-warning">
                      {formatCurrency(calculo.ivaAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};