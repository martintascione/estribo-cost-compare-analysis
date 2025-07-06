import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Scale } from 'lucide-react';
import { Estribo } from '@/hooks/useEstribosData';

interface Props {
  estribos: Estribo[];
  onAgregarEstribo: (estribo: Omit<Estribo, 'id'>) => void;
  onEliminarEstribo: (id: string) => void;
}

export const FormularioEstribos = ({ estribos, onAgregarEstribo, onEliminarEstribo }: Props) => {
  const [medida, setMedida] = useState('');
  const [peso, setPeso] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medida && peso) {
      onAgregarEstribo({
        medida,
        peso: parseFloat(peso)
      });
      setMedida('');
      setPeso('');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="peso">Peso Unitario (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.0001"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ej: 0.0350"
                required
              />
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
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{estribo.medida}</p>
                    <p className="text-sm text-muted-foreground">
                      {estribo.peso.toFixed(4)} kg
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEliminarEstribo(estribo.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};