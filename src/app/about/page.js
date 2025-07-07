// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-[#d4b87e]">
      <h1 className="text-4xl font-bold text-center text-[#FFD700]">เกี่ยวกับเรา</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#FFD700]">ภารกิจของเรา</h2>
        <p className="text-lg text-[#d4b87e]">
          เราคือทีมผู้เชี่ยวชาญด้านการวางแผนและจัดการทริปท่องเที่ยว ที่เชื่อว่าทุกการเดินทางควรจะง่ายและสนุก!
          ไม่ว่าจะเป็นการเดินทางในประเทศหรือต่างประเทศ เราพร้อมดูแลคุณทุกขั้นตอน
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#FFD700]">สิ่งที่เราเชื่อ</h2>
        <ul className="list-disc pl-6 text-[#d4b87e] space-y-2">
          <li>ประสบการณ์ของลูกค้าคือสิ่งสำคัญที่สุด</li>
          <li>ความโปร่งใสและซื่อสัตย์ในการให้บริการ</li>
          <li>ความยืดหยุ่นในการออกแบบทริปตามใจคุณ</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#FFD700]">ทีมของเรา</h2>
        <p>
          ทีมของเราประกอบด้วยผู้เชี่ยวชาญด้านการท่องเที่ยว, ไกด์ท้องถิ่น,
          และผู้จัดการทัวร์ที่มีประสบการณ์มากกว่า 10 ปี
        </p>
      </section>
    </div>
  );
}
