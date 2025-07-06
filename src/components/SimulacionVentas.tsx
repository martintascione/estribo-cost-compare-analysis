import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Package, DollarSign, Calculator, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SimulacionData {
  estribo: { medida: string; peso: number };
  proveedores: Array<{
    proveedor: { nombre: string };
    peso: number; // Peso específico por proveedor
    costoTotal1000: number;
    ventaTotal1000SinIva: number;
    ventaTotal1000ConIva: number;
    ivaTotal1000: number;
    gananciaTotal1000: number;
  }>;
}

interface Props {
  simulacion: SimulacionData[];
}

export const SimulacionVentas = ({ simulacion }: Props) => {
  // Crear una estructura más simple para mostrar los datos
  const datosSimplificados = simulacion.flatMap(item => 
    item.proveedores.map(prov => ({
      medida: item.estribo.medida,
      peso: prov.peso, // Usar el peso específico del proveedor
      proveedor: prov.proveedor.nombre,
      costoTotal: prov.costoTotal1000,
      ventaTotal: prov.ventaTotal1000ConIva,
      ivaTotal: prov.ivaTotal1000,
      ganancia: prov.gananciaTotal1000,
      roi: ((prov.gananciaTotal1000 / prov.costoTotal1000) * 100)
    }))
  );

  // Calcular totales generales
  const totales = datosSimplificados.reduce((acc, item) => ({
    costo: acc.costo + item.costoTotal,
    venta: acc.venta + item.ventaTotal,
    iva: acc.iva + item.ivaTotal,
    ganancia: acc.ganancia + item.ganancia
  }), { costo: 0, venta: 0, iva: 0, ganancia: 0 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Simulación de Ventas</span>
        </div>
        <h2 className="text-3xl font-bold">Venta de 1,000 Unidades por Medida</h2>
        <p className="text-muted-foreground text-lg">
          Análisis completo de costos, ventas y ganancias por proveedor
        </p>
      </div>

      {/* Tabla principal */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Resultados Detallados por Medida y Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold text-center">Medida</TableHead>
                  <TableHead className="font-bold text-center">Proveedor</TableHead>
                  <TableHead className="font-bold text-center">Peso Total<br/><span className="text-xs font-normal">(1,000 unidades)</span></TableHead>
                  <TableHead className="font-bold text-center border-l-2 border-border">Costo Total</TableHead>
                  <TableHead className="font-bold text-center">Venta Total<br/><span className="text-xs font-normal">(con IVA)</span></TableHead>
                  <TableHead className="font-bold text-center">IVA Total</TableHead>
                  <TableHead className="font-bold text-center border-l-2 border-border">Ganancia</TableHead>
                  <TableHead className="font-bold text-center">% Gan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datosSimplificados.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-center font-semibold">{item.medida}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.proveedor}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {(item.peso * 1000).toFixed(1)} kg
                    </TableCell>
                    <TableCell className="text-center font-medium text-destructive border-l-2 border-border">
                      {formatCurrency(item.costoTotal)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      {formatCurrency(item.ventaTotal)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-warning">
                      {formatCurrency(item.ivaTotal)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-success border-l-2 border-border">
                      {formatCurrency(item.ganancia)}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      <Badge variant={item.roi > 50 ? "default" : "secondary"}>
                        {item.roi.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm text-muted-foreground">Costo Total</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totales.costo)}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <ArrowRight className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Venta Total</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totales.venta)}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Calculator className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-sm text-muted-foreground">IVA Total</p>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totales.iva)}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-sm text-muted-foreground">Ganancia Total</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totales.ganancia)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              % Gan Promedio: {((totales.ganancia / totales.costo) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-info/5 to-primary/5 border-info/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Resumen de la Simulación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Total de medidas analizadas:</span> {simulacion.length}
              </div>
              <div>
                <span className="font-medium">Proveedores comparados:</span> {simulacion[0]?.proveedores.length || 0}
              </div>
              <div>
                <span className="font-medium">Unidades totales:</span> {simulacion.length * 1000}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};