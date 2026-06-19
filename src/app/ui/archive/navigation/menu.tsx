'use client'
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import {AnimatePresence} from 'framer-motion'
import Nav from './nav'
import { usePathname } from 'next/navigation';


export default function Menu(){
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname()
    useEffect(() =>{
        isActive ? setIsActive(false) : void null
    }, [pathname])

    return(
        <>
        <div onClick={() => {setIsActive(!isActive)}} className={styles.button}>
            <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </div>
        <AnimatePresence mode='wait'>
            {isActive && <Nav />}
        </AnimatePresence>
        </>
    )
}