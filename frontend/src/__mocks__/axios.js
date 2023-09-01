const mockTermsResponse = {
    data: [
        {
            "id": 97,
            "name": "Summer 2023"
        },
        {
            "id": 98,
            "name": "Fall 2023"
        },
        {
            "id": 154,
            "name": "Spring 2024"
        },
        {
            "id": 167,
            "name": "Summer 2024"
        },
        {
            "id": 172,
            "name": "Fall 2024"
        },
        {
            "id": 175,
            "name": "Spring 2025"
        }
    ]
}

export default {
    get: jest.fn().mockResolvedValue(mockTermsResponse)
}