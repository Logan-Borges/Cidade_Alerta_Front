import Occurrence from "./Occurrence";

const OccurrenceList = () => {

    return (
        <div>
            Listagem de ocorrências!
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Occurrence key={index} loading={true} />
                ))}
            </div>
        </div>
    )
}

export default OccurrenceList;