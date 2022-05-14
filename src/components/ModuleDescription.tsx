/** 模块的解析类型，
 * 一般由 description 项导出，
 * 导出为一个对象，用于描述模块
 */
export type ModuleDescription = {
    /** 用于标记 tsx 文档的名称，方便查询 */
    fileName: string;
    title: string;
    link: string[];
    desc: string;
};
