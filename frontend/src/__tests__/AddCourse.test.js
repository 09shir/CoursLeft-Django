import {render, screen, cleanup, waitFor, act } from '@testing-library/react';
import AddCourse from '../components/AddCourse';

// test('addCourse filler', () => {
//     expect(true).toBe(true);
// })

describe("AddCourse", () => {
    // test("loading screen renders correctly", async () => {
    //     await act( async () => render(<AddCourse/>));
    //     await waitFor(() => {
    //         expect(screen.getByTestId('loading')).toBeInTheDocument();
    //     })
    // })

    test("add course renders correctly", async () => {
        render(<AddCourse />);
        await waitFor(() => {
            expect(screen.getByTestId('addCourse')).toBeInTheDocument();
        })
    })
})