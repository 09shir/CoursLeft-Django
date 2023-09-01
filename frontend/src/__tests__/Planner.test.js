import {render, screen, cleanup, waitFor, act } from '@testing-library/react';
import Planner from '../components/Planner';
import axios from 'axios'

// test("planner filler", () => {
//     expect(true).toBe(true);
// })

describe("Planner", () => {
    test("renders correctly", async () => {
        // render(<Planner />);
        await act( async () => render(<Planner/>));
        const element = screen.getByTestId('planner');
        expect(element).toBeInTheDocument();

        // await waitFor(() => {
        //     render(<Planner />);
        //     expect(screen.getByTestId('planner')).toBeInTheDocument();
        // })
    })

    
})