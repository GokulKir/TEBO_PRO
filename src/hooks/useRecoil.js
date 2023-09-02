import { atom } from "recoil"


const useRecoil = () => {

    const Backid = atom({
        key: "Backid",
        default: null
    }) 

    const UIDSTORING = atom({
        key : "UIDSTORING",
        default : null
    })


    return {
        Backid ,
        UIDSTORING
    }

}

export default useRecoil