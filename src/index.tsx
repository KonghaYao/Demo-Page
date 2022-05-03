import { render } from "solid-js/web";
import Main from "./components/Main";
import Dependence from "./components/Dependence";
const App = () => {
    return (
        <section class="h-screen flex flex-col relative">
            <header>
                <div class="w-full px-8 py-2 bg-gray-400">
                    <div class="text-2xl">DEMO-PAGES</div>
                </div>
            </header>
            <main class="flex-grow bg-gray-100 p-4">
                <Main></Main>
            </main>
            <footer class="absolute bottom-0 w-full h-1/2">
                <Dependence></Dependence>
            </footer>
        </section>
    );
};
render(
    () => <App />,

    document.body
);
