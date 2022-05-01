import { render } from "solid-js/web";
import Main from "./components/Main";

const App = () => {
    return (
        <section class="h-screen flex flex-col">
            <header>
                <div class="w-full px-8 py-2 bg-gray-400">
                    <div class="text-2xl">DEMO-PAGES</div>
                </div>
            </header>
            <main class="flex-grow bg-gray-100 p-4">
                <Main></Main>
            </main>
        </section>
    );
};
render(
    () => <App />,

    document.body
);
