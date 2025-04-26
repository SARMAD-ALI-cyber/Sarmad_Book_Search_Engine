import { useState } from 'react';
import { Book as BookIcon, User, Tag, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from './motion';

type BookProps = {
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    published: boolean;
  };
};

export default function BookCard({ book }: BookProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a deterministic background color based on book category
  const getCategoryColor = (category: string) => {
    const colors = {
      'Fiction': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Science Fiction': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Mystery': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'Romance': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      'Biography': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      'History': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Self-help': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Children': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
              </div>
              <Badge variant={book.published ? "default" : "secondary"} className="ml-2 shrink-0">
                {book.published ? "Published" : "Unpublished"}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 opacity-70" />
                <span>{book.author}</span>
              </div>
              
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 opacity-70" />
                <Badge variant="outline" className={getCategoryColor(book.category)}>
                  {book.category}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 opacity-70" />
                <span>ID: {book.id}</span>
              </div>
            </div>
          </div>
          
          <div 
            className={`
              flex justify-end px-6 py-3 border-t transition-all
              ${isHovered ? 'bg-muted/50' : 'bg-transparent'}
            `}
          >
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}