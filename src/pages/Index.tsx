import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  setCurrentQuery, 
  submitQuery, 
  querySuccess, 
  queryFailure,
  clearError
} from "@/store/querySlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  History, 
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Loader2, 
  AlertCircle,
  Send
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4, generateMockData } from "@/utils/mockUtils";

const Index = () => {
  const dispatch = useAppDispatch();
  const { currentQuery, isLoading, error, queryHistory, results } = useAppSelector(state => state.query);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Show me sales performance for last quarter",
    "Compare revenue by region",
    "What were our top 5 products last month?",
    "Analyze customer demographics by age group"
  ]);
  const { toast } = useToast();

  // Handle query input change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentQuery(e.target.value));
  };

  // Handle query submission
  const handleSubmitQuery = () => {
    if (!currentQuery.trim()) {
      toast({
        title: "Query cannot be empty",
        description: "Please enter a query to analyze",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(submitQuery());
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Generate mock data and random chart type
        const mockResult = generateMockResult(currentQuery);
        dispatch(querySuccess(mockResult));
        toast({
          title: "Query processed successfully",
          description: "Results are now available",
        });
      } catch (err) {
        dispatch(queryFailure("An error occurred while processing your query. Please try again."));
        toast({
          title: "Error",
          description: "Failed to process query",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  // Generate mock result data
  const generateMockResult = (query: string) => {
    const chartTypes = ['bar', 'line', 'pie', 'area'] as const;
    const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
    
    return {
      id: uuidv4(),
      data: generateMockData(randomChartType),
      chartType: randomChartType
    };
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setCurrentQuery(suggestion));
  };

  // Handle history item click
  const handleHistoryClick = (historyItem: string) => {
    dispatch(setCurrentQuery(historyItem));
  };

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Enter key submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitQuery();
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Insight Explorer
          </h1>
          <p className="text-muted-foreground">
            Ask questions, get insights. No technical knowledge required.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Query history */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Query History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {queryHistory.length > 0 ? (
                    queryHistory.map((query, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-secondary/50 rounded-md hover:bg-secondary cursor-pointer transition-colors"
                        onClick={() => handleHistoryClick(query)}
                      >
                        <p className="text-sm line-clamp-2">{query}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No query history yet. Try asking something!</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main content area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Query input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ask Anything
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a business question..."
                      value={currentQuery}
                      onChange={handleQueryChange}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSubmitQuery} 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Ask
                    </Button>
                  </div>

                  {/* Suggested queries */}
                  <div>
                    <p className="text-sm font-medium mb-2">Suggested queries:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error state */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h3 className="font-medium text-destructive">Error processing query</h3>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading state */}
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary/70" />
                    <h3 className="text-xl font-medium">Processing your query...</h3>
                    <p className="text-muted-foreground">Analyzing data and generating insights</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {results.length > 0 && !isLoading && !error && (
              <div className="space-y-6">
                {results.map((result) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue={result.chartType}>
                        <TabsList className="mb-4">
                          <TabsTrigger value="bar">
                            <BarChart2 className="h-4 w-4 mr-2" />
                            Bar Chart
                          </TabsTrigger>
                          <TabsTrigger value="line">
                            <LineChartIcon className="h-4 w-4 mr-2" />
                            Line Chart
                          </TabsTrigger>
                          <TabsTrigger value="pie">
                            <PieChartIcon className="h-4 w-4 mr-2" />
                            Pie Chart
                          </TabsTrigger>
                          <TabsTrigger value="area">
                            <AreaChartIcon className="h-4 w-4 mr-2" />
                            Area Chart
                          </TabsTrigger>
                        </TabsList>

                        <div className="h-[400px] w-full">
                          <TabsContent value="bar">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={result.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </TabsContent>
                          
                          <TabsContent value="line">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={result.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                          </TabsContent>
                          
                          <TabsContent value="pie">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={result.data}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={150}
                                  fill="#8884d8"
                                  dataKey="value"
                                  nameKey="name"
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {result.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </TabsContent>
                          
                          <TabsContent value="area">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={result.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Colors for pie chart
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

export default Index;
