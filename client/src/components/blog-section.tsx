import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="blog" className="section-padding bg-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Floral Tips & Insights</h2>
          <p className="text-xl text-muted-foreground">Expert advice and trending topics in floral design</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="card-shadow overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse" />
                  <div className="h-6 bg-muted rounded mb-3 animate-pulse" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <Card 
                key={post.id} 
                className="card-shadow hover:shadow-xl transition-all group overflow-hidden"
                data-testid={`blog-post-${post.id}`}
              >
                <div className="overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <CardContent className="p-6">
                  <Badge 
                    variant="secondary" 
                    className="mb-2"
                    data-testid={`badge-category-${post.id}`}
                  >
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" data-testid={`text-title-${post.id}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`text-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span data-testid={`text-date-${post.id}`}>
                      {formatDate(post.publishedAt!.toString())}
                    </span>
                    <button 
                      className="text-primary hover:underline flex items-center"
                      data-testid={`link-read-more-${post.id}`}
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" data-testid="button-view-all-articles">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
