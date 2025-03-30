
// UUID generator for mock data
export function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate mock data for different chart types
export function generateMockData(chartType: 'bar' | 'line' | 'pie' | 'area') {
  // Define categories based on common business metrics
  const categories = [
    'Q1', 'Q2', 'Q3', 'Q4',
    'East', 'West', 'North', 'South',
    'Product A', 'Product B', 'Product C', 'Product D',
    'Marketing', 'Sales', 'Operations', 'R&D',
    '18-24', '25-34', '35-44', '45-54', '55+'
  ];
  
  // Select a random subset of categories (3-7)
  const count = Math.floor(Math.random() * 5) + 3;
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  const selectedCategories = shuffled.slice(0, count);
  
  // Generate random values
  return selectedCategories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * 1000) + 100
  }));
}
