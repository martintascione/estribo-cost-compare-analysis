import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const Index = () => {
  // Datos actualizados según la información proporcionada
  const data = [
    {
      medida: "10x10 cm",
      enrique: { peso: 0.0350, costo: 87.50 },
      chino: { peso: 0.0480, costo: 64.98 }
    },
    {
      medida: "12x12 cm", 
      enrique: { peso: 0.0404, costo: 101.00 },
      chino: { peso: 0.0560, costo: 75.81 }
    },
    {
      medida: "15x15 cm",
      enrique: { peso: 0.0485, costo: 121.25 },
      chino: { peso: 0.0680, costo: 92.05 }
    },
    {
      medida: "10x15 cm",
      enrique: { peso: 0.0418, costo: 104.50 },
      chino: { peso: 0.0590, costo: 79.87 }
    },
    {
      medida: "20x20 cm",
      enrique: { peso: 0.0620, costo: 155.00 },
      chino: { peso: 0.0900, costo: 121.83 }
    }
  ];

  const proveedores = {
    enrique: { nombre: "Proveedor Enrique", precioPorKg: 2500 },
    chino: { nombre: "Proveedor Chino", precioPorKg: 1353.71 }
  };

  // Configuración de colores para los gráficos
  const chartConfig = {
    enrique: {
      label: "Enrique",
      color: "hsl(var(--primary))"
    },
    chino: {
      label: "Chino", 
      color: "hsl(var(--secondary))"
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">📊 Análisis de Costos - Estribos de Hierro</h1>
          <p className="text-lg text-muted-foreground">Comparación de costos de producción entre proveedores</p>
        </div>

        {/* Información de Proveedores */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">🔸 {proveedores.enrique.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${proveedores.enrique.precioPorKg.toLocaleString()} / kg
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">🔸 {proveedores.chino.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${proveedores.chino.precioPorKg.toLocaleString()} / kg
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Comparación */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gráfico de Costos */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Comparación de Costos por Unidad</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="medida" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Costo"]}
                  />
                  <Bar dataKey="enrique.costo" fill="var(--color-enrique)" name="Enrique" />
                  <Bar dataKey="chino.costo" fill="var(--color-chino)" name="Chino" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pesos */}
          <Card>
            <CardHeader>
              <CardTitle>⚖️ Comparación de Pesos (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="medida" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`${value.toFixed(4)} kg`, "Peso"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enrique.peso" 
                    stroke="var(--color-enrique)" 
                    strokeWidth={3}
                    name="Enrique"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chino.peso" 
                    stroke="var(--color-chino)" 
                    strokeWidth={3}
                    name="Chino"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Datos Detallada */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Tabla Comparativa Detallada</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Medida</TableHead>
                  <TableHead className="font-semibold">Proveedor Enrique</TableHead>
                  <TableHead className="font-semibold">Proveedor Chino</TableHead>
                  <TableHead className="font-semibold">Diferencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const diferencia = item.enrique.costo - item.chino.costo;
                  const porcentajeAhorro = ((diferencia / item.enrique.costo) * 100);
                  
                  return (
                    <TableRow key={item.medida}>
                      <TableCell className="font-medium">{item.medida}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold">${item.enrique.costo.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{item.enrique.peso.toFixed(4)} kg</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold">${item.chino.costo.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{item.chino.peso.toFixed(4)} kg</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-green-600">
                            -${diferencia.toFixed(2)}
                          </div>
                          <div className="text-sm text-green-600">
                            -{porcentajeAhorro.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Conclusión */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">📌 Conclusión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              A pesar de que los estribos fabricados con hierro del <strong>Proveedor Chino</strong> son más pesados, 
              su <strong>costo por unidad es significativamente menor</strong> debido a un precio por kilo más bajo. 
              Esto representa una <strong>ventaja económica directa</strong> en la producción, especialmente en 
              pedidos grandes o continuos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;