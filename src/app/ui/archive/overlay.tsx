import NavLinks from "./nav-links"

export default function Overlay(){
    return(
        <div className="absolute bottom-0 left-0 w-full flex flex-col pb-10 px-40">
            <div className="items-end flex flex-row justify-between">
                <NavLinks/>
            </div>
        </div>
    )
}