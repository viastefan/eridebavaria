import { Hero } from "@/components/hero/Hero";
import { Categories } from "@/components/sections/Categories";
import { FeaturedVehicle } from "@/components/sections/FeaturedVehicle";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Accessories } from "@/components/sections/Accessories";
import { Technology } from "@/components/sections/Technology";
import { CompareVehicles } from "@/components/sections/CompareVehicles";
import { CustomerStories } from "@/components/sections/CustomerStories";
import { Newsletter } from "@/components/sections/Newsletter";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedVehicle />
      <WhyChooseUs />
      <ProductShowcase />
      <Accessories />
      <Technology />
      <CompareVehicles />
      <CustomerStories />
      <Newsletter />
      <CTA />
    </main>
  );
}
