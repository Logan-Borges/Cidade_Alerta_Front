import './Loading.css';

interface LoadingProps {
    size?: number;
    color?: string;
}

const Loading = ({ size = 20, color = '#fff' }: LoadingProps) => {
    return (
        <span
            className="spinner"
            style={{
                width: size,
                height: size,
                borderTopColor: color
            }}
        ></span>
    );
};

export default Loading;