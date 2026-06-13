import Link from "next/link"
import { playFair } from "../ui/font"

const prjList = [
  {
    name: 'Aethr [WIP/just a landing atm]',
    year: '2026',
    category: ['dev', 'ai', 'agents'],
    href: 'https://aethr-travel.vercel.app/',
  },
  {
    name: 'Fairytown',
    year: '2026',
    category: ['webgl','3d','dev', 'procedural world'],
    href: 'https://github.com/0xMari/fairytown',
  },
  {
    name: 'music sphere [WIP, still]',
    year: '2024',
    category: ['webgl', '3d', 'glsl shader'],
    href: '/projects/sphere',
  },
  
]

export default function Page() {
    return(
      <div className="mt-16 md:mt-18">
        <table className="min-w-full rounded-md text-gray-900">
          <thead className="rounded-md text-left text-lg xl:text-xl font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium">
                year
              </th>
              <th scope="col" className="px-4 py-5 font-medium">
                project
              </th>
              <th scope="col" className="px-4 py-5 font-medium">
                category
              </th>
            </tr>
          </thead>
          <tbody className="text-lg xl:text-xl">
            {prjList.map((prg) =>(
              <tr key={prg.name} className="group hover:text-pink-500">
                <td className="whitespace-nowrap px-4 py-5">
                  {prg.year}
                </td>
                <td className="whitespace-nowrap px-4 py-5">
                  <Link
                    href={prg.href}
                    className="hover:underline">
                      {prg.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-5">
                  {prg.category.map((c) =>(
                    <span key={c} className="border rounded-lg px-2 mx-2">{c}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    )
  }