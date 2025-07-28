import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { ConfiguracionVenta as ConfiguracionVentaType } from '@/hooks/useEstribosData';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Props {
  configuracion: ConfiguracionVentaType;
  onCambiarConfiguracion: (configuracion: ConfiguracionVentaType) => void;
  onActualizarConfiguracion?: (configuracion: ConfiguracionVentaType) => void;
}

export const ConfiguracionVenta = ({ configuracion, onCambiarConfiguracion, onActualizarConfiguracion }: Props) => {
  const [configTemp, setConfigTemp] = useState(configuracion);
  
  const handleActualizar = async () => {
    onCambiarConfiguracion(configTemp);
    if (onActualizarConfiguracion) {
      await onActualizarConfiguracion(configTemp);
    }
  };

  // Sincronizar cuando cambie la configuración externa
  useEffect(() => {
    setConfigTemp(configuracion);
  }, [configuracion]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          Configuración de Venta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="margen">Margen de Ganancia (%)</Label>
              <Input
                id="margen"
                type="number"
                step="0.1"
                value={configTemp.margenGanancia}
                onChange={(e) => setConfigTemp({
                  ...configTemp,
                  margenGanancia: parseFloat(e.target.value) || 0
                })}
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
                value={configTemp.iva}
                onChange={(e) => setConfigTemp({
                  ...configTemp,
                  iva: parseFloat(e.target.value) || 0
                })}
                placeholder="Ej: 21"
              />
              <p className="text-xs text-muted-foreground">
                IVA aplicado sobre el precio con margen de ganancia
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleActualizar} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Actualizar Configuración
            </Button>
          </div>

          {/* Vista previa de cálculo */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-3">Ejemplo de Cálculo:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Costo base:</span>
                <span>{formatCurrency(100)}</span>
              </div>
              <div className="flex justify-between">
                <span>+ Margen ({configTemp.margenGanancia}%):</span>
                <span>{formatCurrency(100 * configTemp.margenGanancia / 100)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Precio sin IVA:</span>
                <span>{formatCurrency(100 * (1 + configTemp.margenGanancia / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span>+ IVA ({configTemp.iva}%):</span>
                <span>{formatCurrency(100 * (1 + configTemp.margenGanancia / 100) * configTemp.iva / 100)}</span>
              </div>
              <div className="flex justify-between font-bold text-primary border-t pt-2">
                <span>Precio final:</span>
                <span>{formatCurrency(100 * (1 + configTemp.margenGanancia / 100) * (1 + configTemp.iva / 100))}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};