import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
    const [count, setCount] = createSignal(100);
    return (
        <div>
            <header>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    href="https://github.com/solidjs/solid"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Solid
                </a>
            </header>
        </div>
    );
};
render(App, document.body);
