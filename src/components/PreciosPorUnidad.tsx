import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

export interface PrecioPorUnidad {
  id: string;
  estriboPrecioId: string;
  medida: string;
  precioUnitario: number;
}

interface Props {
  estribos: Array<{ id: string; medida: string }>;
  preciosPorUnidad: PrecioPorUnidad[];
  onActualizarPrecio: (estriboPrecioId: string, precio: number) => void;
}

export const PreciosPorUnidad = ({ estribos, preciosPorUnidad, onActualizarPrecio }: Props) => {
  const [preciosTemp, setPreciosTemp] = useState<{ [key: string]: number }>({});

  // Inicializar precios temporales
  useEffect(() => {
    const temp: { [key: string]: number } = {};
    estribos.forEach(estribo => {
      const precioExistente = preciosPorUnidad.find(p => p.estriboPrecioId === estribo.id);
      temp[estribo.id] = precioExistente?.precioUnitario || 0;
    });
    setPreciosTemp(temp);
  }, [estribos, preciosPorUnidad]);

  const handleActualizar = async (estriboPrecioId: string) => {
    const precio = preciosTemp[estriboPrecioId] || 0;
    await onActualizarPrecio(estriboPrecioId, precio);
  };

  const handleActualizarTodos = async () => {
    for (const estriboPrecioId of Object.keys(preciosTemp)) {
      await onActualizarPrecio(estriboPrecioId, preciosTemp[estriboPrecioId] || 0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          Precios de Venta por Unidad
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configura precios fijos por unidad para cada medida de estribo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Lista de estribos con precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estribos.map(estribo => (
              <div key={estribo.id} className="space-y-2">
                <Label htmlFor={`precio-${estribo.id}`}>
                  {estribo.medida}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`precio-${estribo.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={preciosTemp[estribo.id] || ''}
                    onChange={(e) => setPreciosTemp({
                      ...preciosTemp,
                      [estribo.id]: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.00"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleActualizar(estribo.id)}
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Precio actual: {formatCurrency(preciosTemp[estribo.id] || 0)}
                </p>
              </div>
            ))}
          </div>

          {/* Botón para actualizar todos */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleActualizarTodos} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Actualizar Todos los Precios
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};