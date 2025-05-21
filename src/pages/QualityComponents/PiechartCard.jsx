import { Piechart } from "./Piechart"


export const PiechartCard=({name="name",rework=100, reject =100, data })=>{
    return (
        <div className="bg-white rounded-xl shadow-md  flex flex-col  w-full transition hover:shadow-lg">
            <div className="flex justify-center font-bold text-3xl ml-4">
                {name}
            </div>
            <div className="w-full h-full">
            <Piechart/>
        </div>

        <div className="flex justify-center">
        <span className=" items-center text-gray-500 text-xl mx-2">
                <span className="mr-1  text-blue-600 text-lg ">●</span>Rework {rework}
        </span>

        <span className=" text-gray-500 text-xl">
                <span className="mr-1  text-blue-400 text-lg mx-2">●</span>Reject {reject}
        </span>
        </div>
        
        </div>
    )
}