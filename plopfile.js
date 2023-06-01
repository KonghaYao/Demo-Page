export default  function (plop) {
    // 创建模板
    plop.setGenerator('create-demo', {
      description: '创建一个新的 Demo',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: '请输入组件名称：'
        },
        {
          type: 'input',
          name: 'title',
          message: '请输入中文标题：'
        },
        {
          type: 'input',
          name: 'description',
          message: '请简短地描述一下：'
        },
      ],
      actions:[
         {
        type: 'add',
        path: 'src/pages/demos/{{ dashCase name }}/index.astro',
        templateFile: 'template/views/demo-component/index.astro.hbs'
      }
      ]})
  };