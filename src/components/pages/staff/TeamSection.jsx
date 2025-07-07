"use client";

import TeamMemberCard from "./TeamMemberCard";

const teamData = [
  {
    name: "Sarah Johnson",
    rating: "4.8",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB34k-bLlTekcWQte57FlYWOV_qNMmomYNAh3cOf0sDfBH8HTcGdqcp8FVlNRUjrvDsb2Euwo2ZtrzTUeRsWB8IibrU08PmyCi5gxSJnh14_A7Y1kcUMBKMWsqXevCeAMOsdiIdnNKRHNNxmmTDJ01EGT7MQPdldlYfPzHyCwKUzW6D1g6IxyOEs3aZWNg6hvRXss1Un_39OxGje0cjBjPSZvEYB-1VgheGtqAONj_fVmPLB2qe7kba3Pn4LSXECv9gOAAp2lYWnPLV",
  },
  {
    name: "Mark Thompson",
    rating: "4.5",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX9dOxFWB5AXccifAeNYcbtC8NTNu1dR2imQo2zGUyS1vU4HnSZtqRcC0yMFr7FYN-m5DVsMr7EskfS60BJcMdQmiDmwO2jS8F4VKjC-YHQfCpKex7ngIg9WvGPlfyXRLXgYlZoy5WVnQdHP2smUmHzW_AcnwGk61cWcSSqAFGdrBnirWDAPCwuv5HE9XMbxxHMaVWOiavcacEMXAnPrOegU_WCwZ48teIF5J2gqAQS44Ah-delizvaqHMXah8dMJOqb1twdYkpRpA",
  },
  {
    name: "Emily Davis",
    rating: "4.9",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiE-JJS1WzKD2Ba7MuOJk_AV2No2Xi3jwtVf3T2f86SoO24OCY0-khGflqJN38OQF_gHAS9WPJOqCMqcBqbROsWEmDYXrI8g9W8rKo235_bFlG8NaUb5kaKuOcn6vA-37ODkXS8QCW3J5L31dXyJXxWcmymV0s3SjKZG1VhTWMO8QyfqAByb27WDI_iZGqDmyG2gQQnexWMwfXrIQgT8i2kAL7Zh6luh9XHx2_Q0ZaLBmolaqhvpW6xpPN_Qmy6g38F59Gj1a-YUYD",
  },
  {
    name: "David Wilson",
    rating: "4.7",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMQgYctDxGJ7HgNv8lSE_-yRFmoWN9aV6Ovnx2NBZZmmOgXw4-QPbW36EkTZUnNNfs0BIUAF9t9VGpF6h75PQ1HGbWSXo0lffb2HSS7Vvwr3cG5Wd1DYpy5JzynQhFSStaxcMa3fOIxoGea-GpS6WbbKIHKJ6B4t47-pF7qNw6lpqBccnlcI_rHtJ8TwAKl8hDkUiUkuupw9QfJm-gRwPDjr6h3iFhxuB7-4ul8tTvBSuC-2EWoyPyFH7hHLnVuo6UrOM6UNjzNhU-",
  },
  {
    name: "Jessica Lee",
    rating: "4.6",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjvuLv045GWj2Kh61gtwD393Sw3QNBaosNpPcVM2M_66CEzn17PJ7b4ehtCVPFk6A-GM_1Z49vxbZ849LrCjAkGZp__Tq7G0146UL7Sujkp6DvvcetDhWcYLjXaGEJpgLrnUE4KOgcmEJ4G-mm81Vzs9Qgvsz3p8Sk9bI-ECzHRXATEiS7zvoTq5DxZ0Up9PfpFKwUjlrCej76Yl4xN88YOpCwaFGJ7_8Tm4ylACwhtOzQ4Yfpc1dAi3mJdiadl2iGfEHlRItqVPd9",
  },
  {
    name: "Michael Brown",
    rating: "4.4",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmCWtHAJQMQRpIMe15r3Gx0h2OBcuWapY8bvVnPDxnTuHEh0ffW4006jnCvQzx3kJ7f4QEmkDVBXPzREkqx20g1ePS0BkEFuu2hAETocz_IB8s-LRhvp11h_Skvx1DQon3tv2TpCQFoeH02N1EOrWJGjb498KC3nbhBfyOD_3k33aJckZVOEUGgELkMJnN1NVQQOucLMmowFqzqWatyS02vfteHbPdPqZrvdu6-jQNlzRT1fRxqIP26K07Z00-coo4seQlHy4x0rgk",
  },
];

export default function TeamSection() {
  return (
    // <section className="px-6 md:px-20 py-10 flex justify-center">
    <section className="px-6 md:px-20 py-10 relative flex w-full min-h-screen justify-center bg-[#231f10] overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="layout-content-container flex flex-col max-w-[960px] w-full">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-white text-[32px] font-bold leading-tight min-w-72">
            Our Team
          </p>
        </div>
        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
          Meet the dedicated team at AdventureCo, committed to crafting
          unforgettable travel experiences. Each member brings a unique set of
          skills and passion to ensure your journey is seamless and enriching.
        </p>
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Staff Members
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          {teamData.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              rating={member.rating}
              imageUrl={member.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
