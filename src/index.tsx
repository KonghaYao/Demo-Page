import { render, Show } from "solid-js/web";
import "./style/global.css";
import Main from "./components/Main";
import Dependence from "./components/dependencePanel/Dependence";
import { ModuleStore } from "./components/dependencePanel/ModuleStore";
const App = () => {
    return (
        <section class="h-screen flex flex-col relative font-song select-none ">
            <header>
                <div class="w-full px-8 py-2 bg-gray-400">
                    <div class="text-2xl">DEMO-PAGES</div>
                </div>
            </header>
            <main class="flex-grow bg-gray-100 p-4">
                <Main></Main>
            </main>
            <Show when={ModuleStore.dependence.show}>
                <div class="absolute bottom-0 w-full h-1/2">
                    <Dependence></Dependence>
                </div>
            </Show>
        </section>
    );
};
render(
    () => <App />,

    document.body
);
