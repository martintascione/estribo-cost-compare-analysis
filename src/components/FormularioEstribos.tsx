import { useState } from 'react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Scale } from 'lucide-react';
import { Estribo } from '@/hooks/useEstribosData';

interface Props {
  estribos: Estribo[];
  proveedores: Array<{ id: string; nombre: string }>;
  onAgregarEstribo: (estribo: Omit<Estribo, 'id'>) => void;
  onEliminarEstribo: (id: string) => void;
}

export const FormularioEstribos = ({ estribos, proveedores, onAgregarEstribo, onEliminarEstribo }: Props) => {
  const [medida, setMedida] = useState('');
  const [pesosPorProveedor, setPesosPorProveedor] = useState<{ [key: string]: string }>({});

  // Inicializar pesos cuando cambien los proveedores
  React.useEffect(() => {
    const pesosIniciales: { [key: string]: string } = {};
    proveedores.forEach(proveedor => {
      pesosIniciales[proveedor.id] = pesosPorProveedor[proveedor.id] || '';
    });
    setPesosPorProveedor(pesosIniciales);
  }, [proveedores]);

  const handlePesoChange = (proveedorId: string, valor: string) => {
    setPesosPorProveedor(prev => ({
      ...prev,
      [proveedorId]: valor
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todosLosPesosCompletos = proveedores.every(proveedor => 
      pesosPorProveedor[proveedor.id] && parseFloat(pesosPorProveedor[proveedor.id]) > 0
    );

    if (medida && todosLosPesosCompletos) {
      const pesosNumericos: { [key: string]: number } = {};
      proveedores.forEach(proveedor => {
        pesosNumericos[proveedor.id] = parseFloat(pesosPorProveedor[proveedor.id]);
      });

      onAgregarEstribo({
        medida,
        pesosPorProveedor: pesosNumericos
      });
      
      setMedida('');
      const pesosVacios: { [key: string]: string } = {};
      proveedores.forEach(proveedor => {
        pesosVacios[proveedor.id] = '';
      });
      setPesosPorProveedor(pesosVacios);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-secondary" />
          Gestión de Estribos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulario para agregar estribo */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medida">Medida</Label>
              <Input
                id="medida"
                value={medida}
                onChange={(e) => setMedida(e.target.value)}
                placeholder="Ej: 10x10 cm"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Peso por Proveedor (kg)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {proveedores.map(proveedor => (
                  <div key={proveedor.id} className="space-y-2">
                    <Label htmlFor={`peso-${proveedor.id}`} className="text-sm text-muted-foreground">
                      {proveedor.nombre}
                    </Label>
                    <Input
                      id={`peso-${proveedor.id}`}
                      type="number"
                      step="0.0001"
                      value={pesosPorProveedor[proveedor.id] || ''}
                      onChange={(e) => handlePesoChange(proveedor.id, e.target.value)}
                      placeholder="Ej: 0.0350"
                      required
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingrese el peso específico por cada proveedor para esta medida
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Estribo
          </Button>
        </form>

        {/* Lista de estribos existentes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Estribos Registrados</h3>
          {estribos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay estribos registrados
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {estribos.map((estribo) => (
                <div
                  key={estribo.id}
                  className="p-3 bg-muted/20 rounded-lg border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{estribo.medida}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEliminarEstribo(estribo.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pesos por proveedor:</p>
                    {proveedores.map(proveedor => (
                      <div key={proveedor.id} className="flex justify-between text-xs">
                        <span>{proveedor.nombre}:</span>
                        <span>{(estribo.pesosPorProveedor[proveedor.id] || 0).toFixed(4)} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};