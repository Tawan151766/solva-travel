"use client";

import { useState } from "react";
import { GalleryImageCard } from "./GalleryImageCard";
import { ImageModal } from "./ImageModal";
import { CategoryFilter } from "./CategoryFilter";
import { useGallery } from "@/contexts/GalleryContext";

const galleryImages = [
  {
    id: 1,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyiH8MQZNeJsi4k50bXAm4KtLTb1vNdw2YZVjHOW7HJdr4rOh4tGnsCjUSU1abeJn1oKg8hxSkBcnHUQYiwNuS0-LWwPu1Ac54jyoPQA1Y7teS1ju0DnfAWU2MWbUa0qvP83rEHjBrzf3VoaRBqq2Ph87jlIi-Hs372GDCw-8csELbxlu7NuIgNFmhp7solkpTO6yBUEUhMODUW0YPuQ_2QMziA2AyW6FDN0UrYXWNFasvYzqGLoHKbTA9ldcjcVHQSMMkbjgUEwrW",
    title: "Mountain Landscape",
    category: "Mountain"
  },
  {
    id: 2,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUfPt0JmB0poNmOHqlA7qrjlrJqHHg0ZjNQB96v8nY2EE8wlXP_X8GeC3wn7U_ITNjlbwVz_uwpPLJYrlabn3UQcdnaI2GJcXXXIhRo44gxDlq_iFaOjR_74V23DawtcPXyOqtl-8lW5A28cY3D6EeJ3FvmGO7uUnXNrmpnpkdj8XWHFkfE7OtshkV7bWfdGtSdIkrvdVHatGP6UadAuIkB7gRQznBuHunTQWDkMomn5kkhHSlOJjN4tYMqjCsh_q6uMmgYx-7hI0Y",
    title: "Ocean View",
    category: "Beach"
  },
  {
    id: 3,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzOl_S3a5V1c3lc74Z4NWpSRJzVgjn2mQNGr5RTSf3PzaPKLLeSfbVHpavYp9ZOywD-sa6UxpxXPjOCqzTSwBiPjiHVPnWDmCBGPOnXUPsv4JuNBGwMHfDAVAGzLgXQYdR8_N7Et2y81tplGTVc3YudcUw04rS98N8gfZf-0tNe57-hTRXC89YzDymHJ5Xe3AqDU0N4s9271T40CvnctyPpdLLq30C8Pa1T-MHxktMzCWiTInE-YWDUbgAPLFPBPDj38LFRSczruAF",
    title: "City Skyline",
    category: "City"
  },
  {
    id: 4,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4wRJuGwUACLHTN1vNYSEc9qtBvT1h4K-tT9E2wIBQoYCqF0preEeODFMcku8OZFhL8LLe37vY4h23N3f2OqMGcSljnpilH5BZRNlVvVeDmxthj20AhpZ1_Cim-CA32AeU1hvZmPVsqlab623WO_7rQX-tdVeGBbcABU00awRp0xtJoHt9Kyl7RiQNsB5gSpti9d3zuvsd7K62pR5oUmjy8fVcvZfXXpHYIyuwUvmoaI3DiBlJpKivkrnPNciAU6ysdNzm2BJ-u7H5",
    title: "Desert Dunes",
    category: "Desert"
  },
  {
    id: 5,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR706JHl3KbRnL1sBJcr1vpgX82arVbj6MMvdi_EWmECzgrgobxDYB2IjkNMjxIF2pqQapJVRLvGzEgYiaga0UujpYqnedNBG11LRszfmO6CH__V6vEIwxMh0h8KH5uZqIoqIGMBDF9DNG8Oyy5TbNHZg2hqil1tWVNZtMx7yJ5qb5wcCrBQFEndvRlJwjvN7f6QIVeUwnzEq7aOJb-Rnf2POMv8FCbRTk_-93Gb5NmyACExHh8s4Pj2iG9BffV_nPiFyEHZ56vn5i",
    title: "Forest Trail",
    category: "Forest"
  },
  {
    id: 6,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv0UjhA7Sd-H2PEOvX3idaO_Wf6XHambhnGWtg35B_NscaPy0dboInTvWFhpbHQzvicQsAGkyjYVAgrSeWmgGWEqRz8twZIDjVJHC1ktXoWJT9tbf5ZCY_I2bGjMv7hIfcTPLhgFag9Rm4-YWSczWEsgA4zcI4093dRxopgudCAyq8XJ3IOmequMEMq_1yGXseVlAc0UzVmwPSnagjLVLlf54x9FVtPc2mvqeUPbL_ipNocPwxaAkQaHiEyUUmunEFpZhCHn4jIvKD",
    title: "Snowy Peaks",
    category: "Mountain"
  },
  {
    id: 7,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsLgyQZ9tSpR1BOLWHYCcStvBI9JmnmMQo2NRzGHWJ_2zPlsUR6dAJGvpLXf8EvYEgarOMmJG1m3UC0NE6jYz3iZlwxgAndS3MDI8rlbBsJLP5tMVTZ4v72VD5E7LLQQXp1zmOjGNI4bushP3bKh4_QFlW3ZduSHwrTo5UVgS_GU9ahhtp9CMBLFmsfKWQ28wgwfkIOOqCSd1JkYiIZE0VgL7MIHkUhun5A4AG9JQJqhCw2BMTShv9_EGcBHLq_AVysk2q9aU9B8nO",
    title: "Tropical Paradise",
    category: "Beach"
  },
  {
    id: 8,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA76HPFH7lUvEBSU-41USE037HhpG4K6xU7_yLwj_3aNXWPioldrgsE1YJFCrqfz6XbkKx83yBQ8Zhjwtp8fSM6dFm6G6vtXcqs9LwqbQEAUhCRSxYPKerSBWldoNCqA5Jwxzh1dZLNu8a9HS8aMqWem_JYigKMQEwH-Y535YVrEShDF6QwPXzpGgBAydNgKNp40grosLbUUrVN0MpoRnKN2JJ1-HhV_3T0G0ju7SjRlzubFp5NC4uli4QeOfXN4tyStuiCXupZM2uz",
    title: "Deep Forest",
    category: "Forest"
  },
  {
    id: 9,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8y_CSV0QJbdsBg5-KbttQO1Zk09vTPnO7YcQw9nRwsmAA_YxpB3fYEIwfdNKGyFJbcGow9SADUQ_x3-FH17g7HMS2TrJptp6kPaR-KK3qq8J__yK7ZVHbYuYdf8SjemvJwgl29R3TANKjJZAC9TYcdMvi-v-yqYOmr5-7mNPGKXm5f87bczFQj7OkzPdJNw7Wmoi10N_Z0LocqbqQZfSGZY9Wbdm5hi-16CpITDyBnXY68FMsH2r91n5NRaAeSuqbe0LpAMFFydl",
    title: "Coastal Beauty",
    category: "Beach"
  },
  {
    id: 10,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA84t4PXkFyjoU1omDp7hyENjvc86cn28sFw5nrOdXgCHDFhnUb242OQzgDmuuWrXCQswLqm3H4JSO108l3JVY4NmZoEUoyrazaBAI6m-M59SvsxVMAnOnE9b_BHTLRXp0TcKkTU-gZF013GpDu9_9J2SWX1L1f2d0_4H0G1KI14vdTFtQfbZ2TLfxtw9HvIAFaNn4Og19BnjxdOiWDHU5b0CnpimrlR2B-gToZ_5iEKfcUiEcINwFK848knBc9hVr5wSDOWffVxnR8",
    title: "Urban Nights",
    category: "City"
  },
  {
    id: 11,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6m-iaMWhf-O34ujTDvWNTrFg8N9Dv3wTfeVREXBYRt8OCpeg9H4k0CGR0hz0OMUpjdIhl3iXGDgFff9x-C71rmKWJdeKgBRwiNhbBUg_bQEBRthG5iFw_TW_dErp0HdpuEBLec2i59RVii0iH8O1wUqAFXndj7YhZ3JL2iJ6rbTY1QvmheT9Jz7gdPkYxHTiy31PlsREeJRNjIpyFo29qvxn-RrQP8-E9_-venF8ZWXXRSxQZhyXUeHuKQNNIzgYXRjisFhnF6Hg8",
    title: "Desert Sunset",
    category: "Desert"
  },
  {
    id: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH4T0XXO_GUV-jrIopqbcMqz_MVDYP5RufEt00knYff63LEte6L9VpIUG-jh0zlcRibJnm582hRn78Hv6LRc9ZIxti6gNL-hou4-krKZ8EMSLVYL_5LotyZTBE0E7W5gh3wFICJku_pk2XcwO15nXRAVwOgRmw8O7KnMkN17K6TX_vf1loar6fuGKATkXtOQruHx6GJClgpY6eaEJVGEJCjQ3Cpal3uriO7v-Ezdj6Qki1t_ROr5-5avR0yfcZNQ6bUQpBcAvJDst_",
    title: "Alpine Lake",
    category: "Mountain"
  }
];

export function GalleryGrid() {
  const { selectedCategory, setSelectedCategory } = useGallery();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Get unique categories
  const categories = [...new Set(galleryImages.map(img => img.category))];

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section>
      <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Gallery ({filteredImages.length} images)
      </h3>
      
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {filteredImages.map((image, index) => (
          <div 
            key={image.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <GalleryImageCard 
              imageUrl={image.imageUrl}
              title={image.title}
              category={image.category}
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <ImageModal
          images={filteredImages}
          currentIndex={selectedImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}
