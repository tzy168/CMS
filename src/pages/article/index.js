import {
    Table, Tag, Space, Form, Card, Breadcrumb, Radio,
    Select, Button, DatePicker, message, Popconfirm, Drawer,
    Input, Upload, Spin
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import locale from "antd/es/date-picker/locale/zh_CN";
import { useChannel } from '../../utils/useChannel';
import { getArticleListAPI, deleteArticleAPI, editArticleAPI, getAritcleDetailAPI } from "../../apis/article";
import ReactQuill from "react-quill";
import './index.scss';
import "react-quill/dist/quill.snow.css";

const { RangePicker } = DatePicker;

const Article = () => {
    const [form] = Form.useForm();
    const { channelList } = useChannel();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [reqData, setReqData] = useState({
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10,
    });
    const [currentId, setCurrentId] = useState('');
    const [articleList, setArticleList] = useState([]);
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateChannel, setUpdateChannel] = useState();
    const [updateContent, setUpdateContent] = useState('');
    const [_type, setType] = useState(0);

    const statusTags = {
        1: <Tag color="red">待审核</Tag>,
        2: <Tag color="green">审核通过</Tag>,
    };

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await getArticleListAPI(reqData);
            setArticleList(res.data.results);
            setCount(res.data.total_count);
        };
        fetchArticles();
    }, [reqData]);

    useEffect(() => {
        const fetchArticleDetail = async () => {
            if (open && currentId) {
                setLoading(true);
                const res = await getAritcleDetailAPI(currentId);
                const _res = res.data;
                setType(_res.cover.type);
                setImages(_res.cover.images.map(url => ({ url })));
                setUpdateTitle(_res.title);
                setUpdateChannel(_res.channel_id);
                setUpdateContent(_res.content);

                form.setFieldsValue({
                    title: _res.title,
                    content: _res.content,
                    channel_id: _res.channel_id,
                    type: _res.cover.type,
                    image: _res.cover.images,
                });
                setLoading(false);
            }
        };
        fetchArticleDetail();
    }, [currentId, form]);

    const showDrawer = (data) => {
        setCurrentId(data.id);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            key: 'cover',
            render: (text, record) => (
                <img src={record.cover.images[0]} alt=" " style={{ width: 50, height: 50 }} />
            ),
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (data) => statusTags[data],
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate',
            key: 'pubdate',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '阅读数',
            dataIndex: 'read_count',
            key: 'read_count',
        },
        {
            title: '评论数',
            dataIndex: 'comment_count',
            key: 'comment_count',
        },
        {
            title: '点赞数',
            dataIndex: 'like_count',
            key: 'like_count',
        },
        {
            title: '操作',
            key: 'action',
            render: (data) => (
                <Space size="middle">
                    <span onClick={() => showDrawer(data)}><EditOutlined /></span>
                    <Popconfirm
                        title="删除此文章？"
                        okText='我意已决'
                        cancelText='三思'
                        onConfirm={() => deleteArticle(data.id)}
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const finish = (val) => {
        const begin_pubdate = val.date?.[0]?.format('YYYY-MM-DD') || '';
        const end_pubdate = val.date?.[1]?.format('YYYY-MM-DD') || '';

        setReqData({
            ...reqData,
            channel_id: val.channel_id,
            status: val.status,
            begin_pubdate,
            end_pubdate,
        });
    };

    const deleteArticle = async (id) => {
        await deleteArticleAPI(id);
        message.success('文章删除成功');
        setReqData({ ...reqData });
    };

    const updateArticle = async () => {
        if (_type !== images.length) {
            if (_type === 3) {
                return message.warning('请上传 3 张封面');
            } else if (_type === 0) {
                setImages([]);
            } else {
                return message.warning('只能上传 1 张封面');
            }
        }

        const imageUrls = images.map(item => item.response?.data?.url || item.url);
        setOpen(false);

        const res = await editArticleAPI(currentId, {
            title: updateTitle,
            content: updateContent,
            channel_id: updateChannel,
            cover: {
                type: _type,
                images: imageUrls,
            },
        });
        message.success(res.message);
        setReqData({ ...reqData });
    };

    const onChange = (value) => {
        setImages(value.fileList);
    };

    return (
        <div>
            <Card title={<Breadcrumb items={[
                { title: <Link to={'/'}>首页</Link> },
                { title: '审核文章列表' }
            ]} />}>
                <Form
                    initialValues={{ status: '', channel_id: '', begin_pubdate: '', end_pubdate: '' }}
                    onFinish={finish}
                >
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 4 }} label="频道" name="channel_id">
                        <Select placeholder="请选择文章频道" style={{ width: 120 }}>
                            {channelList?.map(item => (
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        <RangePicker locale={locale} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">查询</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card title={`查询到 ${count} 条结果:`}>
                <Table
                    rowKey="id"
                    dataSource={articleList}
                    columns={columns}
                    pagination={{ total: count, pageSize: reqData.per_page }}
                    onChange={(page) => setReqData({ ...reqData, page: page.current })}
                />

            </Card>

            <Drawer
                title="修改文章"
                width={720}
                onClose={onClose}
                open={open}
                mask={true}
                styles={{
                    mask: { backgroundColor: 'rgba(200, 0, 0, 0.05)' },
                    body: { textAlign: 'left', background: 'linear-gradient(0deg, #ffe6e6 0%, #ffffff 100%)' },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>取消</Button>
                        <Button onClick={updateArticle} type="primary">提交</Button>
                    </Space>
                }
            >
                {loading ? (
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="标题" name='title' rules={[{ required: true, message: '请输入文章标题' }]}>
                            <Input
                                onChange={(e) => setUpdateTitle(e.target.value)}
                                placeholder="请输入文章标题"
                                style={{ width: 400 }}
                            />
                        </Form.Item>

                        <Form.Item label="频道" name='channel_id' rules={[{ required: true, message: '请选择文章频道' }]}>
                            <Select
                                onChange={(val) => setUpdateChannel(val)}
                                placeholder="请选择频道"
                                style={{ width: 128 }}
                            >
                                {channelList?.map(item => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="封面" name='cover' rules={[{ required: true, message: '请选择文章封面' }]}>
                            <Form.Item name='type'>
                                <Radio.Group onChange={e => setType(e.target.value)}>
                                    <Radio value={1}>单图</Radio>
                                    <Radio value={3}>三图</Radio>
                                    <Radio value={0}>无图</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                {_type > 0 && (
                                    <Upload
                                        maxCount={_type}
                                        listType="picture-card"
                                        action={'http://geek.itheima.net/v1_0/upload'}
                                        name="image"
                                        showUploadList={1}
                                        fileList={images}
                                        onChange={onChange}
                                    >
                                        <div>
                                            <PlusOutlined />
                                        </div>
                                    </Upload>
                                )}
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label="内容" name='content' style={{ width: '60vw' }} rules={[{ required: true, message: '请输入文章内容' }]}>
                            <ReactQuill
                                className="react-quill"
                                theme="snow"
                                placeholder="请输入文章内容"
                                style={{ width: '650px' }}
                                onChange={setUpdateContent}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </div>
    );
};

export default Article;

