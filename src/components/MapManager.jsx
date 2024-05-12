
import CoiVsSingleFamilyMapComponent from "./CoiVsSingleFamilyMapComponent";
import HolcMapComponent from "./HolcMapComponent";
import IncomeVsSingleFamilyMapComponent from "./IncomeVsSingleFamilyMapComponent";
import RaceMapComponent from "./RaceMapComponent";
import Statistics from "./Statistics";




export const MapManager = (props) => {
    const { currentSection, setMapOpened, openMap, setOpenMap } = props;

    const handleClick = () => {
        setOpenMap(null);
        setMapOpened(false);
        // setArchiveMapId(null);
    };

    const displayMap = (openMap) => {
        switch (openMap) {
            case "coi": return <CoiVsSingleFamilyMapComponent setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
            case "income": return <IncomeVsSingleFamilyMapComponent setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
            case "holc": return <HolcMapComponent setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
            case "race": return <RaceMapComponent setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
            case "stat": return <Statistics setOpenMap={setOpenMap} setMapOpened={setMapOpened} />



        }
    };

    return (
        <>
            <div
                className={`z-10 relative transition-all ease-in-out duration-700 `}
            >
                {/* <button className={`z-110000 fixed top-14 left-12  text-sm cursor-pointer text-white hover:text-rose-300 transition-colors  `}
                    onClick={handleClick}>
                    BACK
                </button> */}

                <div className={`z-10 absolute top-0 left-0 w-screen h-screen overflow-y-scroll transition-all ease-in-out duration-700 `}>
                    {displayMap(openMap)}
                </div>




            </div>
        </>);
}





