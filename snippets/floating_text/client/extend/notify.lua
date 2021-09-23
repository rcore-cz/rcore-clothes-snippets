local canShow = false
local textToShow = ""
local textPosition = vector3(0, 0, 0)

function ShowHelpNotification(text)
    textToShow = text
end

-- Will only check if player is near any of the position in config.
CreateThread(function()
    while true do
        Wait(1000)
        canShow = false
        for _, v in pairs(Config.Stores) do
            for key, value in pairs(v.sections) do
                if #(value.pos - playerPos) < 3.5 then
                    canShow = true
                    textPosition = value.pos
                end
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