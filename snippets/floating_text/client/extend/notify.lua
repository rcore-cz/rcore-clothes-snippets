local canShow = false
local textToShow = ""
local textPosition = vector3(0, 0, 0)

Config.ChangePoint.label = "🕵️‍♀️"

function ShowHelpNotification(text)
    textToShow = text
end

-- Will only check if player is near any of the position in config.
CreateThread(function()
    while true do
        Wait(1000)
        canShow = false
        local pPos = GetEntityCoords(PlayerPedId())
        for _, v in pairs(Config.Stores) do
            for key, value in pairs(v.sections) do
                if #(value.pos - pPos) < 3.5 then
                    canShow = true
                    textPosition = value.pos
                end
            end
        end

        for k,v in pairs(Config.ChangePoint.points) do
            if #(v - pPos) < 3.5 then
                canShow = true
                textPosition = value
                textToShow = Config.ChangePoint.help
            end
        end
    end
end)


-- Will display the 3D text
CreateThread(function()
    while true do
        Wait(0)
        if canShow then
            ESX.ShowFloatingHelpNotification(textPosition,textToShow)
        else
            Wait(1000)
        end
    end
end)