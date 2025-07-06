import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ConfiguracionVenta as ConfiguracionVentaType } from '@/hooks/useEstribosData';

interface Props {
  configuracion: ConfiguracionVentaType;
  onCambiarConfiguracion: (configuracion: ConfiguracionVentaType) => void;
}

export const ConfiguracionVenta = ({ configuracion, onCambiarConfiguracion }: Props) => {
  const handleMargenChange = (valor: string) => {
    const nuevoMargen = parseFloat(valor) || 0;
    onCambiarConfiguracion({
      ...configuracion,
      margenGanancia: nuevoMargen
    });
  };

  const handleIvaChange = (valor: string) => {
    const nuevoIva = parseFloat(valor) || 0;
    onCambiarConfiguracion({
      ...configuracion,
      iva: nuevoIva
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" />
          Configuración de Venta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="margen">Margen de Ganancia (%)</Label>
            <Input
              id="margen"
              type="number"
              step="0.1"
              value={configuracion.margenGanancia}
              onChange={(e) => handleMargenChange(e.target.value)}
              placeholder="Ej: 90"
            />
            <p className="text-xs text-muted-foreground">
              Margen aplicado sobre el costo base del producto
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="iva">IVA (%)</Label>
            <Input
              id="iva"
              type="number"
              step="0.1"
              value={configuracion.iva}
              onChange={(e) => handleIvaChange(e.target.value)}
              placeholder="Ej: 21"
            />
            <p className="text-xs text-muted-foreground">
              IVA aplicado sobre el precio con margen de ganancia
            </p>
          </div>
        </div>

        {/* Vista previa de cálculo */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Ejemplo de Cálculo:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Costo base:</span>
              <span>$100.00</span>
            </div>
            <div className="flex justify-between">
              <span>+ Margen ({configuracion.margenGanancia}%):</span>
              <span>$${(100 * configuracion.margenGanancia / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Precio sin IVA:</span>
              <span>$${(100 * (1 + configuracion.margenGanancia / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>+ IVA ({configuracion.iva}%):</span>
              <span>$${(100 * (1 + configuracion.margenGanancia / 100) * configuracion.iva / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-primary border-t pt-2">
              <span>Precio final:</span>
              <span>$${(100 * (1 + configuracion.margenGanancia / 100) * (1 + configuracion.iva / 100)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};