import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="section-padding bg-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground">Stories from our happy flower lovers and students</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2 space-x-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-muted rounded-full mr-3 animate-pulse" />
                    <div>
                      <div className="h-4 bg-muted rounded w-24 mb-1 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-shadow" data-testid={`testimonial-${testimonial.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      data-testid={`badge-type-${testimonial.id}`}
                    >
                      {testimonial.type === 'shop' ? 'Shop Customer' : 'School Student'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4" data-testid={`text-comment-${testimonial.id}`}>
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={testimonial.image || ''} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold" data-testid={`text-name-${testimonial.id}`}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-location-${testimonial.id}`}>
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
