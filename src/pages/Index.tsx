import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, DollarSign, Scale, Calculator, Award } from "lucide-react";

const Index = () => {
  // Datos actualizados
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

  // Cálculos de métricas importantes
  const costoTotalEnrique = data.reduce((sum, item) => sum + item.enrique.costo, 0);
  const costoTotalChino = data.reduce((sum, item) => sum + item.chino.costo, 0);
  const ahorroTotal = costoTotalEnrique - costoTotalChino;
  const porcentajeAhorro = ((ahorroTotal / costoTotalEnrique) * 100);

  // Datos para el gráfico de torta
  const pieData = [
    { name: 'Proveedor Enrique', value: costoTotalEnrique, color: 'hsl(var(--primary))' },
    { name: 'Proveedor Chino', value: costoTotalChino, color: 'hsl(var(--secondary))' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con animación */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Análisis Comparativo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Estribos de Hierro
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comparación detallada de costos y especificaciones entre proveedores
          </p>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-scale-in">
          <Card className="border-2 border-success/20 bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ahorro Total</p>
                  <p className="text-2xl font-bold text-success">${ahorroTotal.toFixed(2)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-info/20 bg-info/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">% de Ahorro</p>
                  <p className="text-2xl font-bold text-info">{porcentajeAhorro.toFixed(1)}%</p>
                </div>
                <Award className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Enrique</p>
                  <p className="text-2xl font-bold text-primary">${costoTotalEnrique.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Chino</p>
                  <p className="text-2xl font-bold text-secondary">${costoTotalChino.toFixed(2)}</p>
                </div>
                <Scale className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de Proveedores Mejorada */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  {proveedores.enrique.nombre}
                </CardTitle>
                <Badge variant="outline" className="border-primary text-primary">Tradicional</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">
                  ${proveedores.enrique.precioPorKg.toLocaleString()}
                </div>
                <p className="text-muted-foreground">por kilogramo</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">Precio más alto</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-secondary flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  {proveedores.chino.nombre}
                </CardTitle>
                <Badge variant="outline" className="border-secondary text-secondary">Económico</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-secondary">
                  ${proveedores.chino.precioPorKg.toLocaleString()}
                </div>
                <p className="text-muted-foreground">por kilogramo</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-success" />
                  <span className="text-success">Mejor precio</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Mejorados */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gráfico de Barras - Costos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Comparación de Costos por Medida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Costo"]}
                  />
                  <Bar 
                    dataKey="enrique.costo" 
                    fill="var(--color-enrique)" 
                    name="Enrique"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="chino.costo" 
                    fill="var(--color-chino)" 
                    name="Chino"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Torta - Distribución de Costos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-secondary" />
                Distribución Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabla Mejorada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-info" />
              Análisis Detallado por Medida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Medida</TableHead>
                    <TableHead className="font-bold text-center">Proveedor Enrique</TableHead>
                    <TableHead className="font-bold text-center">Proveedor Chino</TableHead>
                    <TableHead className="font-bold text-center">Ahorro</TableHead>
                    <TableHead className="font-bold text-center">Mejor Opción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => {
                    const diferencia = item.enrique.costo - item.chino.costo;
                    const porcentajeAhorro = ((diferencia / item.enrique.costo) * 100);
                    
                    return (
                      <TableRow key={item.medida} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">{item.medida}</TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-primary">${item.enrique.costo.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{item.enrique.peso.toFixed(4)} kg</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-secondary">${item.chino.costo.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{item.chino.peso.toFixed(4)} kg</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-success flex items-center justify-center gap-1">
                              <TrendingDown className="w-4 h-4" />
                              ${diferencia.toFixed(2)}
                            </div>
                            <div className="text-xs text-success">
                              {porcentajeAhorro.toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-secondary text-secondary">
                            Chino
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Conclusión Mejorada */}
        <Card className="border-2 border-success/20 bg-gradient-to-r from-success/5 to-info/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6 text-success" />
              Recomendación Final
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">💰 Ventajas Económicas</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    Ahorro de <strong>${ahorroTotal.toFixed(2)}</strong> por lote completo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    Reducción de costos del <strong>{porcentajeAhorro.toFixed(1)}%</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    Precio por kg <strong>46% menor</strong>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">📊 Consideraciones</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    Estribos del proveedor chino son más pesados
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-info"></div>
                    Ideal para <strong>pedidos en volumen</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-info"></div>
                    Ventaja económica <strong>en todas las medidas</strong>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-center font-medium">
                <strong>Recomendación:</strong> El Proveedor Chino ofrece la mejor relación costo-beneficio, 
                con ahorros significativos que justifican la diferencia en peso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;