import { useParams, useNavigate } from 'react-router-dom'; // 导入 useNavigate
import { getAritcleDetailAPI } from '../../apis/article';
import { useEffect, useState } from 'react';
import { Typography, Spin, Alert, Image, Tag, Button } from 'antd';
import { LoadingOutlined, LeftOutlined } from '@ant-design/icons';
import { useChannel } from '../../utils/useChannel';

const { Title, Paragraph, Text } = Typography;

const Detail = () => {
    const { channelList } = useChannel(); // 获取频道列表
    const params = useParams();
    const { id } = params;
    const [articleDetail, setArticleDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 使用 useNavigate

    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                setLoading(true);
                const res = await getAritcleDetailAPI(id);
                if (res && res.data) {
                    console.log(res.data);
                    setArticleDetail(res.data);
                } else {
                    throw new Error('数据格式不正确');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetail();
    }, [id]);

    if (loading) {
        return <Spin indicator={<LoadingOutlined spin />} size="large" style={{ margin: '20px auto' }} />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon style={{ margin: '20px' }} />;
    }

    const { title, content, pub_date, cover, channel_id } = articleDetail;
    console.log(channel_id)

    // 根据 channel_id 查找对应的频道名称
    const channelName = channelList.find(channel => channel.id === channel_id)?.name || '未知频道';

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', textAlign: 'left' }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
                返回
            </Button>
            <Title level={2} style={{ marginBottom: 10 }}>{title}</Title>
            <Paragraph type="secondary" style={{ marginBottom: 20 }}>
                发布时间: {new Date(pub_date).toLocaleString()}
            </Paragraph>
            {cover.images.length > 0 && (
                cover.images.map((image, index) => (<Image
                    width="100%"
                    src={cover.images[index]}
                    alt="文章封面"
                    style={{ marginBottom: 20, borderRadius: 4, size: 'cover' }}
                />
                ))

            )}
            <div dangerouslySetInnerHTML={{ __html: content }} style={{ marginBottom: 20 }} />
            <Text type="secondary">
                频道: <Tag color="blue">{channelName}</Tag>
            </Text>
        </div>
    );
};

export default Detail;