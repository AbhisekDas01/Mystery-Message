'use client';

import React from 'react'


import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay";
import { messages } from "@/lib/messages";

const Home = () => {

  
  return (
    <main className='grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Dive into the world of Anonymous Conversations</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where your identity remains a secret.</p>
      </section>

      <Carousel 
      plugins={[Autoplay({delay: 2000})]}
      className="w-full max-w-[12rem] sm:max-w-xs">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-lg">{message.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{message.received}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

export default Home