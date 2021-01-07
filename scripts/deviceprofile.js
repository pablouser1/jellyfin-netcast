// Device profile
var device_profile = {
    "DeviceProfile": {
        "MaxStreamingBitrate": 120000000, // TODO
        "MaxStaticBitrate": 100000000, // TODO
        "MusicStreamingTranscodingBitrate": 192000, // TODO
        // Profiles suitable for direct play
        "DirectPlayProfiles": [{
            "Container": "ts,mpegts,avi,mkv,m2ts",
            "AudioCodec": "aac,ac3,eac3,mp3,dca,dts",
            "VideoCodec": "h264",
            "Type": "Video"
        }, {
            "Container": "mp4,m4v",
            "AudioCodec": "aac,ac3,eac3,mp3,dca,dts",
            "VideoCodec": "h264,mpeg4",
            "Type": "Video"
        }, {
            "Container": "mp3",
            "Type": "Audio"
        }, {
            "Container": "jpeg",
            "Type": "Photo"
        }],
        "TranscodingProfiles": [{
            "Container": "mp3",
            "Type": "Audio",
            "AudioCodec": "mp3",
            "EstimateContentLength": false,
            "EnableMpegtsM2TsMode": false,
            "TranscodeSeekInfo": "Auto",
            "CopyTimestamps": false,
            "Context": "Streaming",
            "EnableSubtitlesInManifest": false,
            "MinSegments": 0,
            "SegmentLength": 0,
            "BreakOnNonKeyFrames": false
        }, {
            "Container": "ts",
            "Type": "Video",
            "VideoCodec": "h264",
            "AudioCodec": "ac3,aac,mp3",
            "EstimateContentLength": false,
            "EnableMpegtsM2TsMode": false,
            "TranscodeSeekInfo": "Auto",
            "CopyTimestamps": false,
            "Context": "Streaming",
            "EnableSubtitlesInManifest": false,
            "MinSegments": 0,
            "SegmentLength": 0,
            "BreakOnNonKeyFrames": false
        }, {
            "Container": "jpeg",
            "Type": "Photo",
            "EstimateContentLength": false,
            "EnableMpegtsM2TsMode": false,
            "TranscodeSeekInfo": "Auto",
            "CopyTimestamps": false,
            "Context": "Streaming",
            "EnableSubtitlesInManifest": false,
            "MinSegments": 0,
            "SegmentLength": 0,
            "BreakOnNonKeyFrames": false
        }],
        "ContainerProfiles": [{
            "Type": "Photo",
            "Conditions": [{
                "Condition": "LessThanEqual",
                "Property": "Width",
                "Value": "1920",
                "IsRequired": true
            }, {
                "Condition": "LessThanEqual",
                "Property": "Height",
                "Value": "1080",
                "IsRequired": true
            }]
        }],
        "CodecProfiles": [{
            "Type": "Video",
            "Conditions": [{
                "Condition": "LessThanEqual",
                "Property": "Width",
                "Value": "1920",
                "IsRequired": true
            }, {
                "Condition": "LessThanEqual",
                "Property": "Height",
                "Value": "1080",
                "IsRequired": true
            }, {
                "Condition": "LessThanEqual",
                "Property": "VideoFramerate",
                "Value": "30",
                "IsRequired": true
            }],
            "ApplyConditions": [],
            "Codec": "mpeg4"
        }, {
            "Type": "Video",
            "Conditions": [{
                "Condition": "LessThanEqual",
                "Property": "Width",
                "Value": "1920",
                "IsRequired": true
            }, {
                "Condition": "LessThanEqual",
                "Property": "Height",
                "Value": "1080",
                "IsRequired": true
            }, {
                "Condition": "LessThanEqual",
                "Property": "VideoLevel",
                "Value": "41",
                "IsRequired": true
            }],
            "ApplyConditions": [],
            "Codec": "h264"
        }, {
            "Type": "VideoAudio",
            "Conditions": [{
                "Condition": "LessThanEqual",
                "Property": "AudioChannels",
                "Value": "6",
                "IsRequired": true
            }],
            "ApplyConditions": [],
            "Codec": "ac3,eac3,aac,mp3"
        }],
        "ResponseProfiles": [{
            "Container": "m4v",
            "Type": "Video",
            "MimeType": "video/mp4",
            "Conditions": []
        }, {
            "Container": "ts,mpegts",
            "Type": "Video",
            "MimeType": "video/mpeg",
            "Conditions": []
        }],
        "SubtitleProfiles": [{
            "Format": "srt",
            "Method": "Embed"
        }, {
            "Format": "srt",
            "Method": "External"
        }]
    },
    "PlayableMediaTypes": ["Audio", "Video", "Photo"],
    "SupportsMediaControl": false, // Need web sockets for that
    "SupportsPersistentIdentifier": false
}
