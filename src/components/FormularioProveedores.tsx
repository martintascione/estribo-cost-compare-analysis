import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Building2 } from 'lucide-react';
import { Proveedor } from '@/hooks/useEstribosData';
import { formatCurrency } from '@/lib/utils';

interface Props {
  proveedores: Proveedor[];
  onAgregarProveedor: (proveedor: Omit<Proveedor, 'id'>) => void;
  onEliminarProveedor: (id: string) => void;
}

export const FormularioProveedores = ({ proveedores, onAgregarProveedor, onEliminarProveedor }: Props) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && precio) {
      onAgregarProveedor({
        nombre,
        precioPorKg: parseFloat(precio)
      });
      setNombre('');
      setPrecio('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Gestión de Proveedores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulario para agregar proveedor */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Proveedor</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Proveedor ABC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por Kg ($)</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 2500.00"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proveedor
          </Button>
        </form>

        {/* Lista de proveedores existentes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Proveedores Registrados</h3>
          {proveedores.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay proveedores registrados
            </p>
          ) : (
            proveedores.map((proveedor) => (
              <div
                key={proveedor.id}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium">{proveedor.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(proveedor.precioPorKg)} por kg
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formatCurrency(proveedor.precioPorKg / 1000)}/g
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEliminarProveedor(proveedor.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};