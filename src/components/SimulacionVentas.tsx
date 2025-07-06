import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, DollarSign, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SimulacionData {
  estribo: { medida: string; peso: number };
  proveedores: Array<{
    proveedor: { nombre: string };
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
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Simulación de Venta: 1,000 Unidades</h2>
        <p className="text-muted-foreground">
          Análisis financiero de las 3 principales medidas de estribos
        </p>
      </div>

      {simulacion.map((item, index) => (
        <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Medida: {item.estribo.medida}
              <Badge variant="outline" className="ml-auto">
                {item.estribo.peso.toFixed(4)} kg/unidad
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {item.proveedores.map((provData, provIndex) => (
                <div key={provIndex} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <h3 className="font-semibold text-lg">{provData.proveedor.nombre}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Costos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        COSTOS
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Costo Total</p>
                        <p className="text-xl font-bold text-destructive">
                          {formatCurrency(provData.costoTotal1000)}
                        </p>
                      </div>
                    </div>

                    {/* Ventas */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Receipt className="w-4 h-4" />
                        VENTAS
                      </div>
                      <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                        <p className="text-sm text-muted-foreground">Venta Sin IVA</p>
                        <p className="text-lg font-bold text-success">
                          {formatCurrency(provData.ventaTotal1000SinIva)}
                        </p>
                      </div>
                    </div>

                    {/* Venta con IVA */}
                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">Venta Con IVA</p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(provData.ventaTotal1000ConIva)}
                      </p>
                    </div>

                    {/* IVA */}
                    <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                      <p className="text-sm text-muted-foreground">IVA Total</p>
                      <p className="text-lg font-bold text-warning">
                        {formatCurrency(provData.ivaTotal1000)}
                      </p>
                    </div>
                  </div>

                  {/* Ganancia destacada */}
                  <div className="bg-gradient-to-r from-success/10 to-info/10 p-4 rounded-lg border-2 border-success/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        <span className="font-medium">Ganancia Neta</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">
                          {formatCurrency(provData.gananciaTotal1000)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {((provData.gananciaTotal1000 / provData.costoTotal1000) * 100).toFixed(1)}% ROI
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Resumen total */}
      <Card className="border-2 border-info/20 bg-gradient-to-r from-info/5 to-primary/5">
        <CardHeader>
          <CardTitle className="text-center">Resumen de Simulación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Unidades</p>
              <p className="text-3xl font-bold text-primary">3,000</p>
              <p className="text-xs text-muted-foreground">1,000 por medida</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Medidas Analizadas</p>
              <p className="text-3xl font-bold text-secondary">{simulacion.length}</p>
              <p className="text-xs text-muted-foreground">Principales productos</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Proveedores</p>
              <p className="text-3xl font-bold text-accent">
                {simulacion[0]?.proveedores.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">En comparación</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};