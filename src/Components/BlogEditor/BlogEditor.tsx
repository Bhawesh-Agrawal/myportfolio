"use client";

import Navbar from "@/Components/Navbar/page";
import { useEffect, useState, useRef, useCallback } from "react";
import { useEditorContext } from "@/app/Editor/EditorContext";
import { getTools } from "@/app/Editor/tools";
import { Upload, Save, AlertCircle, CheckCircle, Clock } from "lucide-react";

// Dynamic import types
type EditorJS = any;
type OutputData = any;

declare global {
    interface Window {
        cloudinary: any;
    }
}

const BlogEditor = () => {
    const {
        blog,
        setBlog,
        isLoading,
        setIsLoading,
        isSaving,
        lastSaved
    } = useEditorContext();

    const { title, banner, content, tags, des } = blog;
    const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);
    const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    // Load Cloudinary widget
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;
        script.onload = () => setCloudinaryLoaded(true);
        script.onerror = () => console.error("Failed to load Cloudinary widget");
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Initialize EditorJS
    useEffect(() => {
        if (typeof window === 'undefined' || !cloudinaryLoaded) return;

        let isMounted = true;
        setIsLoading(true);

        // Custom CSS for better editor styling (minimal, keeping original design)
        const addEditorStyles = () => {
            const existingStyle = document.getElementById('editor-custom-styles');
            if (existingStyle) return;

            const style = document.createElement('style');
            style.id = 'editor-custom-styles';
            style.textContent = `
                .codex-editor {
                    width: 100% !important;
                }
                .codex-editor__redactor {
                    padding-bottom: 200px !important;
                }
                .ce-block__content,
                .ce-toolbar__content {
                    max-width: none !important;
                    margin: 0 !important;
                }
                .ce-block {
                    width: 100% !important;
                }
            `;
            document.head.appendChild(style);
        };

        const initEditor = async () => {
            try {
                const [EditorJS, tools] = await Promise.all([
                    import('@editorjs/editorjs').then(mod => mod.default),
                    getTools()
                ]);

                if (!isMounted) return;

                addEditorStyles();

                // Prepare editor data
                let editorData: OutputData;
                if (content && typeof content === 'object' && 'blocks' in content) {
                    editorData = content;
                } else if (Array.isArray(content)) {
                    editorData = { blocks: content };
                } else {
                    editorData = { blocks: [] };
                }

                const editor = new EditorJS({
                    holderId: "text-editor",
                    data: editorData,
                    tools: tools,
                    placeholder: "Let's write an awesome story",
                    autofocus: false,
                    onChange: async () => {
                        if (!editor || !isMounted) return;

                        try {
                            const outputData = await editor.save();
                            // Debounce the content update to prevent lag
                            setBlog(prev => ({ ...prev, content: outputData }));
                        } catch (error) {
                            console.error('Error saving editor content:', error);
                        }
                    },
                    onReady: () => {
                        if (isMounted) {
                            setEditorReady(true);
                            setIsLoading(false);
                        }
                    }
                });

                if (isMounted) {
                    setEditorInstance(editor);
                }
            } catch (error) {
                console.error('Failed to initialize editor:', error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initEditor();

        return () => {
            isMounted = false;
            if (editorInstance && editorInstance.destroy) {
                editorInstance.destroy();
            }
        };
    }, [cloudinaryLoaded, content]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const style = document.getElementById('editor-custom-styles');
            if (style) {
                style.remove();
            }
        };
    }, []);

    // Banner upload with better UX
    const openUploadWidget = useCallback(() => {
        if (!cloudinaryLoaded || !window.cloudinary) {
            alert("Image uploader is not ready. Please wait a moment and try again.");
            return;
        }

        setUploadingBanner(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dj8qro2de",
                uploadPreset: "portfolio-blog",
                sources: ["local", "url", "camera", "image_search"],
                multiple: false,
                cropping: true,
                folder: "blog_banners",
                maxFileSize: 10000000,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                showUploadMoreButton: false,
                showPoweredBy: false,
                croppingAspectRatio: 16/9,
                styles: {
                    palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#6366f1",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#6366f1",
                        action: "#6366f1",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#6366f1",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1"
                    }
                }
            },
            (error: any, result: any) => {
                setUploadingBanner(false);

                if (error) {
                    console.error("Banner upload error:", error);
                    alert("Failed to upload banner image. Please try again.");
                    return;
                }

                if (result && result.event === "success") {
                    const uploadedURL = result.info.secure_url;
                    setBlog(prev => ({ ...prev, banner: uploadedURL }));
                }
            }
        );

        widget.open();
    }, [cloudinaryLoaded, setBlog]);

    // Title handlers
    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus editor when Enter is pressed
            if (editorReady && editorRef.current) {
                const editorElement = editorRef.current.querySelector('[contenteditable="true"]') as HTMLElement;
                if (editorElement) {
                    editorElement.focus();
                }
            }
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
        setBlog(prev => ({ ...prev, title: input.value }));
    };

    // Auto-resize title on mount and when title changes
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Status Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-2">
                <div className="mx-auto max-w-[900px] flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {isLoading && (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                                <span>Loading editor...</span>
                            </div>
                        )}

                        {isSaving && !isLoading && (
                            <div className="flex items-center space-x-2 text-blue-600">
                                <Save size={16} />
                                <span>Saving...</span>
                            </div>
                        )}

                        {!isSaving && !isLoading && lastSaved && (
                            <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle size={16} />
                                <span>Saved {lastSaved.toLocaleTimeString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-gray-500">
                        {title.length > 0 && `${title.length} characters in title`}
                    </div>
                </div>
            </div>

            <section className="py-8">
                <div className="mx-auto max-w-[900px] w-full px-4">
                    {/* Banner Upload */}
                    <div className="relative mb-8">
                        <div
                            className={`relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 hover:border-indigo-400 cursor-pointer rounded-lg transition-all duration-200 overflow-hidden group ${
                                uploadingBanner ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={uploadingBanner ? undefined : openUploadWidget}
                        >
                            {banner ? (
                                <>
                                    <img
                                        className="w-full h-full object-cover"
                                        src={banner}
                                        alt="Blog banner"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                                            <Upload size={32} className="mx-auto mb-2" />
                                            <p className="text-sm font-medium">Change Banner</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    {uploadingBanner ? (
                                        <>
                                            <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                                            <p className="text-sm font-medium">Uploading banner...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={48} className="mb-4 text-gray-400" />
                                            <p className="text-lg font-medium mb-2">Add a banner image</p>
                                            <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="mb-8">
                        <textarea
                            ref={titleRef}
                            placeholder="Your blog title..."
                            className="w-full text-4xl font-bold text-gray-900 bg-transparent outline-none resize-none leading-tight placeholder:text-gray-400 placeholder:font-normal"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                            value={title}
                            maxLength={120}
                            style={{ minHeight: '80px' }}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">
                                Press Enter to start writing content
                            </p>
                            <span className={`text-xs ${title.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                                {title.length}/120
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    {/* Editor */}
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                                <div className="text-center">
                                    <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600">Preparing your editor...</p>
                                </div>
                            </div>
                        )}

                        <div
                            ref={editorRef}
                            id="text-editor"
                            className="min-h-[400px] bg-white rounded-lg"
                        />

                        {!cloudinaryLoaded && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                                <AlertCircle size={16} className="text-yellow-600" />
                                <span className="text-sm text-yellow-700">
                                    Image upload service is loading. Please wait before adding images.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogEditor;