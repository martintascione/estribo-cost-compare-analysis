import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingDown, DollarSign } from 'lucide-react';
import { CalculoDetallado } from '@/hooks/useEstribosData';

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

  // Datos para el gráfico
  const datosGrafico = datosAgrupados.map(item => {
    const resultado: any = { medida: item.medida };
    item.proveedores.forEach((prov: any) => {
      resultado[prov.nombre] = prov.precioConIva;
    });
    return resultado;
  });

  const chartConfig = calculos.reduce((config, calculo, index) => {
    const color = index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))';
    config[calculo.proveedor.nombre] = {
      label: calculo.proveedor.nombre,
      color
    };
    return config;
  }, {} as any);

  return (
    <div className="space-y-6">
      {/* Gráfico de comparación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Comparación de Precios Finales
          </CardTitle>
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
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Precio Final"]}
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
                      ${calculo.costoBase.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      ${calculo.precioFinalSinIva.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-success">
                      ${calculo.precioFinalConIva.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-warning">
                      ${calculo.ivaAmount.toFixed(2)}
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