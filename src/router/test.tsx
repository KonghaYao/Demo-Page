import { Route, Link } from "./index";
export default () => {
    return (
        <nav>
            <Link href="/test" element={<button>clickme</button>}></Link>
            <Route path="/" element={<div>1</div>}></Route>
            <Route path="/test" element={<div>test</div>}></Route>
        </nav>
    );
};
