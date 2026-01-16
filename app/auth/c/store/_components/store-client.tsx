"use client";

import { useState, useMemo } from "react";
import { Search, Clock, ShoppingBag, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExtendedItem } from "@/repositories/item-repository";
import ItemCard from "./itemCard";

type FilterType = "all" | "available" | "reservation" | "closed";

interface StoreClientProps {
  items: ExtendedItem[];
  hasOrder: boolean;
}

export default function StoreClient({ items, hasOrder }: StoreClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const categorizedItems = useMemo(() => {
    return items.map((item) => {
      const orderClosed = new Date(item.schoolStore.orderClose) < new Date();
      const reservationClosed =
        new Date(item.schoolStore.reservationClose) < new Date();
      const hasReservation = !!item.reservation;

      let status: "available" | "reservation" | "closed";
      if (!orderClosed) {
        status = "available";
      } else if (hasReservation && !reservationClosed) {
        status = "reservation";
      } else {
        status = "closed";
      }

      return { ...item, status };
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = categorizedItems;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.item.name.toLowerCase().includes(query) ||
          item.item.description.toLowerCase().includes(query) ||
          item.store.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((item) => item.status === activeFilter);
    }

    // Sort: available first, then reservation, then closed
    return filtered.sort((a, b) => {
      const order = { available: 0, reservation: 1, closed: 2 };
      return order[a.status] - order[b.status];
    });
  }, [categorizedItems, searchQuery, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: categorizedItems.length,
      available: categorizedItems.filter((i) => i.status === "available").length,
      reservation: categorizedItems.filter((i) => i.status === "reservation")
        .length,
      closed: categorizedItems.filter((i) => i.status === "closed").length,
    };
  }, [categorizedItems]);

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Všetko", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    {
      key: "available",
      label: "Dostupné",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      key: "reservation",
      label: "Rezervácia",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg py-3 -mx-2 px-2 border-b border-border/50">
        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Hľadať produkty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.icon}
                {filter.label}
                <span
                  className={cn(
                    "ml-1 text-xs",
                    activeFilter === filter.key
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground/70"
                  )}
                >
                  ({counts[filter.key]})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.item.id}
              item={item}
              hasOrder={hasOrder}
              status={item.status}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-1">Žiadne produkty</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {searchQuery
              ? "Skús upraviť vyhľadávanie alebo zmeniť filter"
              : "Momentálne nie sú k dispozícii žiadne produkty"}
          </p>
        </div>
      )}
    </div>
  );
}
