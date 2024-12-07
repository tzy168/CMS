import { Breadcrumb, Button, Card, Form, Input, Select, Space, Radio, Upload, message } from "antd";
import { Link } from "react-router-dom"
import ReactQuill from "react-quill";
import { PlusOutlined } from '@ant-design/icons';
import "react-quill/dist/quill.snow.css";
import "./index.scss"
import { useState } from "react";
import { createArticleAPI } from "../../apis/article";
import { useChannel } from "../../utils/useChannel";


const Publish = () => {
    const { channelList } = useChannel()
    console.log(channelList);
    const [_type, setType] = useState(1)
    const [imageList, setImageList] = useState([])
    // console.log(imageList);
    const imagesURL = imageList.map(item => item.response.data.url)
    const finish = (val) => {
        if (imagesURL.length !== _type) return message.warning(`请上${_type}张封面`)
        const { title, content, channel_id, type } = val
        //处理数据
        const reqData = {
            title: title,
            content: content,
            cover: {
                type: type,
                images: imagesURL
            },
            channel_id: channel_id
        }
        console.log(reqData);
        createArticleAPI(reqData).then(res => {
            message.success(res.message)
        })
        setImageList([])
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    }

    //上传回调
    const onChange = (info) => {
        console.log('info:', info);
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
            setImageList(info.fileList)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    }

    return (
        <div className="publish">

            <Card title={<Breadcrumb items={[
                { title: <Link to={'/'}>首页</Link> },
                { title: '发布文章' }]} />}>
                <Form wrapperCol={{ span: 4 }} initialValues={{ type: 1 }} onFinish={(val) => finish(val)}>
                    <Form.Item >
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item label="标题" name='title' rules={[{ required: true, message: '请输入文章标题' }]}>
                        <Input placeholder="请输入文章标题" style={{ width: 400, left: 10 }} />
                    </Form.Item>

                    <Form.Item label="频道" name='channel_id' rules={[{ required: true, message: '请选择文章频道' }]}>
                        <Select placeholder="请选择文章频道" style={{ width: 120, left: 10 }}>
                            {/* <Select.Option value={0}>推荐</Select.Option> */}
                            {channelList &&
                                channelList.map(item =>
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item label="封面" rules={[{ required: true, message: '请选择文章封面' }]}>
                        <Form.Item name='type'>
                            <Radio.Group onChange={e => setType(e.target.value)} >
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {_type > 0 &&
                            <Upload maxCount={_type}
                                listType="picture-card"
                                action={'http://geek.itheima.net/v1_0/upload'}
                                name="image"
                                showUploadList={3}
                                onChange={onChange}
                            >
                                <div style={{ Button: '40px' }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>

                        }

                    </Form.Item>

                    <Form.Item label="内容" name='content' style={{ width: '60vw' }} rules={[{ required: true, message: '请输入文章内容' }]}>
                        <ReactQuill
                            className="react-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>

                </Form>
            </Card>

        </div>
    );
};

export default Publish;