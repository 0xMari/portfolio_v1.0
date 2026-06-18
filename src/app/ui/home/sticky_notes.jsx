'use client'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const STICKY_NOTES = [
    {
        id: 'grab',
        title: 'GRAB ME',
        lines: [],
        color: '#65f0ef',
        variant: 'hero',
    },
    {
        id: 'available',
        title: 'Available for',
        lines: [
            '- interactive web experiences',
            '- installations,',
            '- weird ideas that need',
            '  to feel alive.',
        ],
        color: '#bdeeee',
    },
    {
        id: 'groceries',
        title: 'Grocery list',
        lines: [
            '- Avocado',
            '- Tomato sauce',
            '- Grana Padano',
            '- Butter',
            '- Anchovies',
        ],
        color: '#fff08a',
    },
    {
        id: 'tech-stack',
        title: 'Tech stack',
        lines: [
            'Next.js / React',
            'Three.js + R3F',
            'GSAP',
            'Tailwind CSS',
            'Blender',
            'WebGL',
        ],
        color: '#f8b4d9',
    },
]

export const MOBILE_HIDDEN_STICKY_NOTE_IDS = new Set(['grab'])

const NOTE_WIDTH = 2.35
const NOTE_HEIGHT = 1.58
const NOTE_DEPTH = 0.045
const PILE_BLOCK_DEPTH = 0.18
const PILE_FALL_SCROLL_THRESHOLD = 0.3
const PILE_FALL_GRAVITY = 12
const PILE_FLOOR_BOUNCE = 0.14
const LIFTED_NOTE_Z = -0.25
const ACTIVE_MOBILE_NOTE_Z = 1.18
const PILE_DESKTOP_POSITION = [-3.15, -1.18, -0.95]
const PILE_NARROW_POSITION = [0, -1.78, -0.12]

function getNoteDefinition(id) {
    return STICKY_NOTES.find((note) => note.id === id)
}

function getSecondPageFloorY(viewport, stageSize) {
    const viewportHeight = stageSize.height || 1
    const scrollY = typeof window === 'undefined' ? 0 : window.scrollY
    const secondPageBottomY = viewportHeight * 2 - scrollY

    return (0.5 - secondPageBottomY / viewportHeight) * viewport.height + 0.32
}

function createNoteTexture(note) {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 720

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#1a1a1a'
    context.textBaseline = 'top'

    if (note.variant === 'hero') {
        context.textAlign = 'center'
        context.font = '800 148px Arial, sans-serif'
        context.fillText(note.title, canvas.width / 2, 250)
        context.strokeStyle = 'rgba(20, 30, 30, 0.18)'
        context.lineWidth = 8
        context.beginPath()
        context.moveTo(218, 445)
        context.quadraticCurveTo(510, 480, 804, 445)
        context.stroke()
    } else {
        context.textAlign = 'left'
        context.font = '700 74px Arial, sans-serif'
        context.fillText(note.title, 76, 76)

        context.fillStyle = '#243131'
        context.font = note.lines.length > 5 ? '500 54px Arial, sans-serif' : '500 58px Arial, sans-serif'
        const lineHeight = note.lines.length > 5 ? 63 : 70

        note.lines.forEach((line, index) => {
            context.fillText(line, 76, 188 + index * lineHeight)
        })

        context.strokeStyle = 'rgba(20, 30, 30, 0.18)'
        context.lineWidth = 7
        context.beginPath()
        context.moveTo(76, 606)
        context.quadraticCurveTo(280, 628, 480, 610)
        context.quadraticCurveTo(650, 594, 846, 616)
        context.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true

    return texture
}

function StickyNoteSheet({ index, geometry, material }) {
    return (
        <mesh
            geometry={geometry}
            material={material}
            position={[-index * 0.018, index * 0.012, -index * NOTE_DEPTH * 0.72]}
            rotation={[0, 0, index * 0.006]}
        />
    )
}

function StickyNotePileBlock({ geometry, material }) {
    return (
        <mesh
            geometry={geometry}
            material={material}
            position={[0.045, -0.035, -(NOTE_DEPTH + PILE_BLOCK_DEPTH) / 2]}
            rotation={[0, 0, -0.008]}
        />
    )
}

function TexturedStickyNote({ geometry, noteMaterial, textMaterial, position = [0, 0, 0], rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh geometry={geometry} material={noteMaterial} />
            <mesh position={[0, 0, NOTE_DEPTH / 2 + 0.003]}>
                <planeGeometry args={[NOTE_WIDTH * 0.9, NOTE_HEIGHT * 0.82]} />
                <primitive object={textMaterial} attach="material" />
            </mesh>
        </group>
    )
}

function screenToWorld(screenPosition, stageSize, viewport, z = LIFTED_NOTE_Z) {
    return [
        ((screenPosition.x / stageSize.width) - 0.5) * viewport.width,
        (0.5 - (screenPosition.y / stageSize.height)) * viewport.height,
        z,
    ]
}

function getScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
}

function LiftedStickyNote({
    note,
    geometry,
    noteMaterial,
    textMaterial,
    stageSize,
    viewport,
    scale,
    z = LIFTED_NOTE_Z,
}) {
    const liftedNote = useRef()
    const initialPosition = screenToWorld({
        x: note.position.x,
        y: note.position.y - getScrollY(),
    }, stageSize, viewport, z)

    useFrame(() => {
        if (!liftedNote.current) return

        const nextPosition = screenToWorld({
            x: note.position.x,
            y: note.position.y - getScrollY(),
        }, stageSize, viewport, z)

        liftedNote.current.position.set(...nextPosition)
    })

    return (
        <group
            ref={liftedNote}
            position={initialPosition}
            rotation={[0, 0, 0]}
            scale={scale}
        >
            <TexturedStickyNote
                geometry={geometry}
                noteMaterial={noteMaterial}
                textMaterial={textMaterial}
            />
        </group>
    )
}

export function StickyNotes({
    notes = [],
    stageSize,
    badgeMode = 'attached',
    mobileDeskMode = false,
    activeMobileItem = null,
}) {
    const pile = useRef()
    const pileNotes = useRef()
    const pileFallVelocity = useRef(0)
    const pileLanded = useRef(false)
    const pileReleased = useRef(false)
    const viewport = useThree((state) => state.viewport)
    const isNarrow = viewport.width < 5
    const pilePosition = isNarrow ? PILE_NARROW_POSITION : PILE_DESKTOP_POSITION
    const noteGeometry = useMemo(() => new THREE.BoxGeometry(NOTE_WIDTH, NOTE_HEIGHT, NOTE_DEPTH), [])
    const pileBlockGeometry = useMemo(() => new THREE.BoxGeometry(NOTE_WIDTH, NOTE_HEIGHT, PILE_BLOCK_DEPTH), [])
    const pileBlockMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7de8e5', roughness: 0.8 }), [])
    const noteMaterials = useMemo(() => new Map(STICKY_NOTES.map((note) => [
        note.id,
        new THREE.MeshStandardMaterial({ color: note.color, roughness: 0.74 }),
    ])), [])
    const textMaterials = useMemo(() => new Map(STICKY_NOTES.map((note) => [
        note.id,
        new THREE.MeshBasicMaterial({
            map: createNoteTexture(note),
            transparent: true,
            toneMapped: false,
        }),
    ])), [])
    const noteStateById = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes])
    const remainingNotes = STICKY_NOTES.filter((note) => !noteStateById.get(note.id)?.lifted)
    const visibleNoteDefinitions = mobileDeskMode
        ? STICKY_NOTES.filter((note) => !MOBILE_HIDDEN_STICKY_NOTE_IDS.has(note.id))
        : STICKY_NOTES
    const liftedNotes = visibleNoteDefinitions
        .map((note) => ({ ...noteStateById.get(note.id), definition: note }))
        .filter((note) => note.lifted && note.position)
    const topPileNote = remainingNotes[0]
    const bottomPileNotes = remainingNotes.slice(1)

    useEffect(() => {
        pileFallVelocity.current = 0
        pileLanded.current = false
        pileReleased.current = false
    }, [])

    useFrame((state, delta) => {
        if (mobileDeskMode || !pile.current) return

        const safeDelta = Math.min(delta, 0.033)

        const scrollY = typeof window === 'undefined' ? 0 : window.scrollY
        const releaseScrollY = stageSize.height * PILE_FALL_SCROLL_THRESHOLD

        if (!pileReleased.current && scrollY < releaseScrollY) {
            pile.current.position.set(...pilePosition)
            pile.current.rotation.set(5.2, 0, 0)
            if (pileNotes.current) pileNotes.current.visible = true
            return
        }

        if (!pileReleased.current) {
            pileReleased.current = true
            pileFallVelocity.current = 0
            if (pileNotes.current) pileNotes.current.visible = false
        }

        const floorY = getSecondPageFloorY(viewport, stageSize)

        if (pileLanded.current) {
            pile.current.position.y = floorY
            pileFallVelocity.current = 0
            pileLanded.current = true
        } else {
            pileFallVelocity.current -= PILE_FALL_GRAVITY * safeDelta
            pile.current.position.y += pileFallVelocity.current * safeDelta

            if (pile.current.position.y <= floorY) {
                pile.current.position.y = floorY

                if (Math.abs(pileFallVelocity.current) > 0.55) {
                    pileFallVelocity.current *= -PILE_FLOOR_BOUNCE
                } else {
                    pileFallVelocity.current = 0
                    pileLanded.current = true
                }
            }
        }

        pile.current.position.x = THREE.MathUtils.damp(pile.current.position.x, pilePosition[0], 3, safeDelta)
        pile.current.position.z = THREE.MathUtils.damp(pile.current.position.z, pilePosition[2], 3, safeDelta)
        pile.current.rotation.x = THREE.MathUtils.damp(pile.current.rotation.x, 5.2, 3, safeDelta)
        pile.current.rotation.y = THREE.MathUtils.damp(pile.current.rotation.y, 0, 3, safeDelta)
        pile.current.rotation.z = THREE.MathUtils.damp(pile.current.rotation.z, 0, 3, safeDelta)
    })

    return (
        <>
            {!mobileDeskMode && (
                <group
                    ref={pile}
                    position={pilePosition}
                    rotation={[5.2, 0, 0]}
                    scale={isNarrow ? 0.58 : 0.92}
                >
                    <StickyNotePileBlock
                        geometry={pileBlockGeometry}
                        material={pileBlockMaterial}
                    />

                    <group ref={pileNotes}>
                        {bottomPileNotes.map((note, index) => (
                            <StickyNoteSheet
                                key={note.id}
                                index={bottomPileNotes.length - index}
                                geometry={noteGeometry}
                                material={noteMaterials.get(note.id)}
                            />
                        ))}

                        {topPileNote && (
                            <TexturedStickyNote
                                geometry={noteGeometry}
                                noteMaterial={noteMaterials.get(topPileNote.id)}
                                textMaterial={textMaterials.get(topPileNote.id)}
                            />
                        )}
                    </group>
                </group>
            )}

            {liftedNotes.map((note) => {
                const definition = getNoteDefinition(note.id) ?? note.definition
                const isActiveMobileItem = mobileDeskMode && activeMobileItem === note.id

                return (
                    <LiftedStickyNote
                        key={note.id}
                        note={note}
                        geometry={noteGeometry}
                        noteMaterial={noteMaterials.get(definition.id)}
                        textMaterial={textMaterials.get(definition.id)}
                        stageSize={stageSize}
                        viewport={viewport}
                        scale={isNarrow ? 0.58 : 0.92}
                        z={isActiveMobileItem ? ACTIVE_MOBILE_NOTE_Z : LIFTED_NOTE_Z}
                    />
                )
            })}
        </>
    )
}
