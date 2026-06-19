import Link from "next/link"

const prjList = [
  {
    name:'Little Things',
    year:'2026',
    description: 'Interactive 3D blind box experiment with a full Blender-to-web pipeline.',
    category: ['3d', 'blender', 'dev'],
    href: 'https://github.com/0xMari/blindbox',
  },
  {
    name: 'Aethr',
    year: '2026',
    description: '[WIP] AI travel product, landing completed, currently focused on agents logic.',
    category: ['dev', 'ai', 'agents'],
    href: 'https://aethr-travel.vercel.app/',
  },
  {
    name: 'Fairytown',
    year: '2026',
    description: 'Procedural WebGL world built around playful exploration and 3D systems.',
    category: ['webgl','3d','dev', 'procedural world'],
    href: 'https://github.com/0xMari/fairytown',
  },
  {
    name: 'Blobs',
    year: '2026',
    description: 'WebGL playground for soft metaball-like shapes, motion, and material studies.',
    category: ['webgl','3d', 'playground'],
    href: 'https://v3-murex.vercel.app/',
  },
]

export default function Page() {
    return(
      <main className=" font-mono min-h-screen w-full overflow-x-hidden px-6 pb-12 pt-28 text-foreground sm:px-8 md:px-5 md:pt-24 lg:px-10">
        <section className="mx-auto w-full max-w-6xl">
          <div className="md:hidden">
            {prjList.map((prg) => (
              <article
                key={prg.name}
                className="border-t border-current py-7 last:border-b"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-5">
                  <Link
                    href={prg.href}
                    className="min-w-0 break-words text-2xl leading-tight hover:text-pink-500 sm:text-3xl"
                  >
                    {prg.name}
                  </Link>
                  <span className="pt-1 text-base leading-none">{prg.year}</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/75">
                  {prg.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-foreground/75">
                  {prg.category.map((c) => (
                    <span
                      key={c}
                      className="leading-none before:mr-1 before:content-['/']"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full table-fixed rounded-md text-foreground">
              <colgroup>
                <col className="w-24 lg:w-32" />
                <col className="w-[30%]" />
                <col className="w-[34%]" />
                <col />
              </colgroup>
              <thead className="rounded-md text-left text-lg font-normal xl:text-xl">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium">
                    year
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    project
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    description
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    category
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg xl:text-xl">
                {prjList.map((prg) =>(
                  <tr key={prg.name} className="group hover:text-pink-500">
                    <td className="px-4 py-5 align-top">
                      {prg.year}
                    </td>
                    <td className="px-4 py-5 align-top">
                      <Link
                        href={prg.href}
                        className="inline-block max-w-full break-words leading-snug hover:underline">
                          {prg.name}
                      </Link>
                    </td>
                    <td className="px-4 py-5 align-top text-base leading-snug text-foreground/75 group-hover:text-pink-500 xl:text-lg">
                      {prg.description}
                    </td>
                    <td className="px-4 py-5 align-top">
                      <div className="flex flex-wrap gap-2">
                        {prg.category.map((c) =>(
                          <span key={c} className="rounded-md border border-current px-2 py-1 text-sm leading-none xl:text-base">{c}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    )
  }
