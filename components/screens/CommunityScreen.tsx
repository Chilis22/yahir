import React from 'react';
import { useAppContext } from '../../App';

const CommunityScreen = () => {
    const { appState } = useAppContext();

    return (
        <div className="space-y-4">
            <div className="flex justify-around bg-white p-1 rounded-lg border border-slate-200">
                <button className="w-full text-center p-2 bg-sky-500 text-white rounded-md font-semibold text-sm">Feed Global</button>
                <button className="w-full text-center p-2 text-slate-600 hover:bg-slate-100 rounded-md font-semibold text-sm">Mis Grupos</button>
                <button className="w-full text-center p-2 text-slate-600 hover:bg-slate-100 rounded-md font-semibold text-sm">Competencias</button>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                {appState.posts.map(post => (
                    <div key={post.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            {post.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold text-slate-900">{post.user}</span> {post.action}
                            </p>
                            <div className="flex space-x-4 mt-2 text-xs text-slate-500">
                                <button className="hover:text-sky-500 font-semibold">Reaccionar</button>
                                <button className="hover:text-sky-500 font-semibold">Comentar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityScreen;