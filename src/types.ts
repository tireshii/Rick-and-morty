interface Character {
    id: number,
    name: string,
    image: string,
    species: string,
    status: string,
    gender: string
    location: {
        name: string
        link: string
    }
}
interface APIResponseOk {
    info: {
        count: number,
        pages: number
    }
    results: Character []
}
interface APIResponseError{
    error: string
}
