import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, DollarSign, Users } from 'lucide-react';
import { CalculoDetallado } from '@/hooks/useEstribosData';
import { formatCurrency } from '@/lib/utils';

interface Props {
  calculos: CalculoDetallado[];
  calculosPorUnidad?: any[];
}

export const ComparacionPrecios = ({ calculos, calculosPorUnidad = [] }: Props) => {
  const [modoPorUnidad, setModoPorUnidad] = useState(false);
  
  const datosActuales = modoPorUnidad ? calculosPorUnidad : calculos;
  const [discriminarIva, setDiscriminarIva] = useState(false);
  
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
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Gráfico de barras */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm sm:text-base">Costo de Fabricación</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Costo base por proveedor (sin margen ni IVA)
            </p>
            <div className="p-2 sm:p-3 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm font-medium">
                📊 {proveedorMasEconomicoUnidad.nombre} es {diferenciaPorcentualUnidad}% más económico que {proveedorMasCaroUnidad.nombre}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-60 sm:h-80">
              <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="medida" 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={60}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), "Costo"]}
                />
                {Object.keys(chartConfig).map((proveedorNombre, index) => (
                  <Bar 
                    key={proveedorNombre}
                    dataKey={proveedorNombre} 
                    fill={chartConfig[proveedorNombre].color}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de torta */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-sm sm:text-base">Precios por Kg</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Comparación de costos por kilogramo
            </p>
            <div className="p-2 sm:p-3 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm font-medium">
                💡 {proveedorMasEconomicoKg.nombre}: {formatCurrency(proveedorMasEconomicoKg.precioPorKg)}/kg vs {proveedorMasCaroKg.nombre}: {formatCurrency(proveedorMasCaroKg.precioPorKg)}/kg
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={pieChartConfig} className="h-60 sm:h-80">
              <PieChart>
                <Pie
                  data={proveedoresUnicos}
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 640 ? 70 : 100}
                  dataKey="precioPorKg"
                  nameKey="nombre"
                  label={({ nombre, precioPorKg }) => window.innerWidth < 640 ? `${formatCurrency(precioPorKg)}` : `${nombre}: ${formatCurrency(precioPorKg)}`}
                  labelLine={false}
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Análisis Detallado de Precios</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="discriminar-iva"
              checked={discriminarIva}
              onCheckedChange={setDiscriminarIva}
            />
            <Label htmlFor="discriminar-iva" className="text-sm">Discriminar IVA</Label>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Agrupar por proveedor */}
            {calculos.reduce((proveedoresUnicos, calculo) => {
              if (!proveedoresUnicos.find(p => p.id === calculo.proveedor.id)) {
                proveedoresUnicos.push(calculo.proveedor);
              }
              return proveedoresUnicos;
            }, [] as any[]).map(proveedor => {
              const calculosProveedor = calculos
                .filter(c => c.proveedor.id === proveedor.id)
                .sort((a, b) => a.estribo.medida.localeCompare(b.estribo.medida));

              return (
                 <div key={proveedor.id} className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <Badge variant="secondary" className="text-sm sm:text-base px-2 py-1 w-fit">
                      {proveedor.nombre}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({formatCurrency(proveedor.precioPorKg)} por kg)
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-xs sm:text-sm px-2">Medida</TableHead>
                        <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden sm:table-cell">
                          Peso (kg)
                        </TableHead>
                        <TableHead className="font-bold text-center text-xs sm:text-sm px-2">
                          Costo
                          <div className="text-xs font-normal text-muted-foreground hidden sm:block">con IVA</div>
                        </TableHead>
                        {discriminarIva && (
                          <TableHead className="font-bold text-center border-r-2 border-border text-xs sm:text-sm px-2 hidden lg:table-cell">IVA Créd.</TableHead>
                        )}
                        <TableHead className={`font-bold text-center text-xs sm:text-sm px-2 ${discriminarIva ? 'border-l-2 border-border hidden lg:table-cell' : ''}`}>
                          Venta
                          <div className="text-xs font-normal text-muted-foreground hidden sm:block">con IVA</div>
                        </TableHead>
                        {discriminarIva && (
                          <>
                            <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden lg:table-cell">IVA Déb.</TableHead>
                            <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden lg:table-cell">IVA Pagar</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculosProveedor.map((calculo, index) => {
                        // Calcular IVA crédito del costo base (que incluye IVA)
                        const ivaCredito = calculo.costoBase * (21 / 121); // IVA incluido en el costo base
                        const ivaAPagar = calculo.ivaAmount - ivaCredito; // IVA a pagar = IVA débito - IVA crédito
                        
                        return (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-semibold text-xs sm:text-sm px-2">{calculo.estribo.medida}</TableCell>
                            <TableCell className="text-center text-xs sm:text-sm px-2 hidden sm:table-cell">{calculo.estribo.peso.toFixed(4)}</TableCell>
                            <TableCell className="text-center font-medium text-xs sm:text-sm px-2">
                              {formatCurrency(calculo.costoBase)}
                            </TableCell>
                            {discriminarIva && (
                              <TableCell className="text-center text-green-600 text-xs sm:text-sm px-2 hidden lg:table-cell">
                                {formatCurrency(ivaCredito)}
                              </TableCell>
                            )}
                            <TableCell className={`text-center font-medium text-primary text-xs sm:text-sm px-2 ${discriminarIva ? 'hidden lg:table-cell' : ''}`}>
                              {formatCurrency(calculo.precioFinalConIva)}
                            </TableCell>
                            {discriminarIva && (
                              <>
                                <TableCell className="text-center text-orange-600 text-xs sm:text-sm px-2 hidden lg:table-cell">
                                  {formatCurrency(calculo.ivaAmount)}
                                </TableCell>
                                <TableCell className="text-center font-bold text-red-600 text-xs sm:text-sm px-2 hidden lg:table-cell">
                                  {formatCurrency(ivaAPagar)}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Mensaje informativo para móviles cuando IVA está discriminado */}
          {discriminarIva && (
            <div className="lg:hidden mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 En pantallas pequeñas solo se muestran las columnas principales. Usa una pantalla más grande para ver el desglose completo del IVA.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};