"use client";

import React from "react";
import Link from "next/link";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import SectionHeading from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Users, ArrowRight } from "lucide-react";
import Image from "next/image";

const SellersPage = () => {
  const { data: stores, isLoading } = useGetAllStoresQuery();

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-16">
        <SectionHeading title="Our Trusted Sellers" />
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Discover unique products from our curated collection of verified sellers.
          Quality and reliability in every shop.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-lg">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores?.data?.map((store) => (
            <Link href={`/sellers/${store._id}`} key={store._id} className="group">
              <Card className="overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-background to-secondary/30 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  {store.banner ? (
                    <Image
                      src={store.banner}
                      alt={store.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">{store.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Logo Overlay */}
                  <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-xl border-4 border-background overflow-hidden shadow-lg bg-white">
                    {store.logo ? (
                      <Image
                        src={store.logo}
                        alt={`${store.name} logo`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <span className="text-primary font-bold">{store.name[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-8 pt-10 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-700 px-2 py-1 rounded-md text-sm font-semibold">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      <span>{store.rating || (Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 mb-6 text-sm flex-grow">
                    {store.description || "Discover high-quality products and exceptional service at our store."}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-secondary">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{store.location || "USA"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{store.followers || Math.floor(Math.random() * 1000 + 100)} Followers</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
                    Visit Store <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && (!stores?.data || stores.data.length === 0) && (
        <div className="text-center py-20 bg-secondary/20 rounded-3xl">
          <p className="text-2xl font-semibold text-muted-foreground">No sellers found.</p>
        </div>
      )}
    </div>
  );
};

export default SellersPage;
