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
interface APIResponse {
    info: {
        count: number,
        pages: number
    }
    results: Character []
}